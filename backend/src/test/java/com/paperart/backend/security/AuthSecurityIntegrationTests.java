package com.paperart.backend.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.paperart.backend.scheduler.R2CleanupScheduler;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import software.amazon.awssdk.services.s3.S3Client;

@SpringBootTest(
    properties = {
      "spring.datasource.url=jdbc:h2:mem:paperart_m2_security;MODE=MySQL;DB_CLOSE_DELAY=-1;DATABASE_TO_LOWER=TRUE;NON_KEYWORDS=YEAR",
      "jwt.cookie-secure=true",
      "csrf.cookie-secure=true"
    })
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthSecurityIntegrationTests {

  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper objectMapper;
  @MockitoBean private S3Client s3Client;
  @MockitoBean private R2CleanupScheduler cleanupScheduler;

  @Value("${jwt.secret}")
  private String jwtSecret;

  @AfterEach
  void leavesNoRequestContextOrObjectStorageCalls() {
    assertThat(org.slf4j.MDC.get("traceId")).isNull();
    verifyNoInteractions(s3Client);
  }

  @ParameterizedTest
  @ValueSource(strings = {"/authors", "/categories"})
  void initialParallelReadsDoNotInvalidateSearchCsrf(String metadataPath) throws Exception {
    var csrfResponse = mockMvc.perform(get("/auth/csrf")).andExpect(status().isOk()).andReturn();
    String token =
        objectMapper
            .readTree(csrfResponse.getResponse().getContentAsString())
            .get("token")
            .asText();
    Cookie browserCookie = csrfResponse.getResponse().getCookie("XSRF-TOKEN");
    // Both requests started without a cookie. Simulate the metadata response arriving last.
    var metadataResponse =
        mockMvc.perform(get(metadataPath)).andExpect(status().isOk()).andReturn();
    Cookie lateCookie = metadataResponse.getResponse().getCookie("XSRF-TOKEN");
    if (lateCookie != null) {
      browserCookie = lateCookie;
    }
    mockMvc
        .perform(
            post("/arts/search")
                .cookie(browserCookie)
                .header("X-XSRF-TOKEN", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
        .andExpect(status().isOk());
    assertThat(lateCookie)
        .as("Read-only metadata must not overwrite the CSRF bootstrap cookie")
        .isNull();
  }

  private MvcResult login(String username, String password, String ip, int expectedStatus)
      throws Exception {
    return mockMvc
        .perform(
            withCsrf(post("/auth/login"))
                .with(
                    request -> {
                      request.setRemoteAddr(ip);
                      return request;
                    })
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    objectMapper.writeValueAsString(
                        Map.of("username", username, "password", password))))
        .andExpect(status().is(expectedStatus))
        .andReturn();
  }

  private Cookie adminCookie() throws Exception {
    return login("test-admin", "test-password", "192.0.2.10", 200)
        .getResponse()
        .getCookie("PAPERART_SESSION");
  }

  private com.fasterxml.jackson.databind.JsonNode createUser(String role, boolean enabled)
      throws Exception {
    String username = "m2-" + UUID.randomUUID();
    var result =
        mockMvc
            .perform(
                withCsrf(post("/users"))
                    .cookie(adminCookie())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        objectMapper.writeValueAsString(
                            Map.of(
                                "username",
                                username,
                                "password",
                                "fixture-password",
                                "enabled",
                                enabled,
                                "roles",
                                role.equals("NONE") ? List.of() : List.of(role)))))
            .andExpect(status().isOk())
            .andReturn();
    return objectMapper.readTree(result.getResponse().getContentAsString());
  }

  private void assertError(MvcResult result, String code) throws Exception {
    jsonPath("$.code").value(code).match(result);
    jsonPath("$.traceId").isNotEmpty().match(result);
    jsonPath("$.traceId").value(result.getResponse().getHeader("X-Trace-Id")).match(result);
    assertThat(result.getResponse().getContentAsString())
        .doesNotContain("fixture-password", "test-password", "stackTrace");
  }

  @ParameterizedTest
  @CsvSource({
    "ADMIN,200,200,200,200",
    "ART_MANAGE,200,403,403,403",
    "AUTHOR_MANAGE,403,200,403,403",
    "CATEGORY_MANAGE,403,403,200,403",
    "NONE,403,403,403,403"
  })
  void actualLoginRolesControlManagementAndAdminRoutes(
      String role, int arts, int authors, int categories, int users) throws Exception {
    var account = createUser(role, true);
    Cookie session =
        login(account.get("username").asText(), "fixture-password", "192.0.2.11", 200)
            .getResponse()
            .getCookie("PAPERART_SESSION");
    mockMvc
        .perform(get("/auth/me").cookie(session))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.username").value(account.get("username").asText()));
    String[] paths = {"/arts/admin", "/authors/admin", "/categories/admin", "/users", "/roles"};
    int[] expected = {arts, authors, categories, users, users};
    for (int i = 0; i < paths.length; i++) {
      var result =
          mockMvc
              .perform(get(paths[i]).cookie(session))
              .andExpect(status().is(expected[i]))
              .andReturn();
      if (expected[i] == 403) {
        assertError(result, "FORBIDDEN");
      }
    }
    // A malformed dryRun is rejected before any cleanup can execute, even for ADMIN.
    var cleanup =
        mockMvc
            .perform(withCsrf(post("/admin/r2/cleanup-unused-files?dryRun=bad")).cookie(session))
            .andExpect(status().is(role.equals("ADMIN") ? 400 : 403))
            .andReturn();
    assertError(cleanup, role.equals("ADMIN") ? "INVALID_REQUEST" : "FORBIDDEN");
  }

  @ParameterizedTest
  @ValueSource(strings = {"malformed", "expired", "wrong-signature"})
  void invalidSessionCookiesAreUnauthenticated(String kind) throws Exception {
    String signingSecret =
        kind.equals("wrong-signature")
            ? "a-different-test-signing-secret-at-least-32-bytes"
            : jwtSecret;
    String token =
        kind.equals("malformed")
            ? "not-a-jwt"
            : Jwts.builder()
                .subject("test-admin")
                .expiration(
                    Date.from(Instant.now().plusSeconds(kind.equals("expired") ? -60 : 600)))
                .signWith(
                    Keys.hmacShaKeyFor(signingSecret.getBytes(StandardCharsets.UTF_8)),
                    Jwts.SIG.HS256)
                .compact();
    var result =
        mockMvc
            .perform(get("/users").cookie(new Cookie("PAPERART_SESSION", token)))
            .andExpect(status().isUnauthorized())
            .andReturn();
    assertError(result, "UNAUTHORIZED");
    mockMvc
        .perform(get("/auth/me").cookie(new Cookie("PAPERART_SESSION", token)))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.code").value("SESSION_EXPIRED"));
  }

  @Test
  void roleRevocationAndAccountDisableAffectAnExistingCookie() throws Exception {
    var account = createUser("ART_MANAGE", true);
    Cookie session =
        login(account.get("username").asText(), "fixture-password", "192.0.2.12", 200)
            .getResponse()
            .getCookie("PAPERART_SESSION");
    mockMvc.perform(get("/arts/admin").cookie(session)).andExpect(status().isOk());
    Cookie admin = adminCookie();
    mockMvc
        .perform(
            withCsrf(put("/users/" + account.get("id").asText()))
                .cookie(admin)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"roles\":[]}"))
        .andExpect(status().isOk());
    mockMvc.perform(get("/arts/admin").cookie(session)).andExpect(status().isForbidden());
    mockMvc
        .perform(withCsrf(patch("/users/" + account.get("id").asText() + "/disable")).cookie(admin))
        .andExpect(status().isOk());
    mockMvc.perform(get("/arts/admin").cookie(session)).andExpect(status().isUnauthorized());
    mockMvc.perform(get("/auth/me").cookie(session)).andExpect(status().isUnauthorized());
  }

  @Test
  void fiveFailedLoginsBlockFurtherAttemptsButNotOtherAccountsOrAddresses() throws Exception {
    var account = createUser("NONE", true);
    String username = account.get("username").asText();
    for (int i = 0; i < 5; i++) {
      assertError(login(username, "incorrect", "192.0.2.20", 401), "INVALID_CREDENTIALS");
    }
    assertError(login(username, "fixture-password", "192.0.2.20", 429), "LOGIN_RATE_LIMITED");
    login(username, "fixture-password", "192.0.2.21", 200);
    var other = createUser("NONE", true);
    login(other.get("username").asText(), "fixture-password", "192.0.2.20", 200);
  }

  @Test
  void successfulLoginClearsPriorFailuresThroughTheApi() throws Exception {
    String username = createUser("NONE", true).get("username").asText();
    for (int i = 0; i < 4; i++) {
      login(username, "incorrect", "192.0.2.22", 401);
    }
    login(username, "fixture-password", "192.0.2.22", 200);
    login(username, "incorrect", "192.0.2.22", 401);
    login(username, "fixture-password", "192.0.2.22", 200);
  }

  @Test
  void wrongPasswordUnknownAndDisabledAccountsHaveTheSamePublicError() throws Exception {
    String enabled = createUser("NONE", true).get("username").asText();
    String disabled = createUser("NONE", false).get("username").asText();
    for (String username : new String[] {enabled, disabled, "missing-" + UUID.randomUUID()}) {
      var result =
          login(
              username,
              username.equals(enabled) ? "incorrect" : "fixture-password",
              "192.0.2.23",
              401);
      assertError(result, "INVALID_CREDENTIALS");
      jsonPath("$.message").value("帳號或密碼錯誤").match(result);
      assertThat(result.getResponse().getCookie("PAPERART_SESSION")).isNull();
    }
  }

  @Test
  void csrfMismatchIsRejectedAndAnonymousWritesRemainUnauthenticated() throws Exception {
    var csrfResult = mockMvc.perform(get("/auth/csrf")).andReturn();
    var rejected =
        mockMvc
            .perform(
                post("/arts/search")
                    .cookie(csrfResult.getResponse().getCookie("XSRF-TOKEN"))
                    .header("X-XSRF-TOKEN", "wrong-token")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{}"))
            .andExpect(status().isForbidden())
            .andReturn();
    assertError(rejected, "CSRF_INVALID");
    var anonymous =
        mockMvc
            .perform(
                withCsrf(post("/categories")).contentType(MediaType.APPLICATION_JSON).content("{"))
            .andExpect(status().isUnauthorized())
            .andReturn();
    assertError(anonymous, "UNAUTHORIZED");
  }

  @Test
  void allowedOriginSupportsPreflightCredentialsAndTraceHeader() throws Exception {
    mockMvc
        .perform(
            options("/auth/login")
                .header("Origin", "http://localhost:5173")
                .header("Access-Control-Request-Method", "POST")
                .header("Access-Control-Request-Headers", "Content-Type,X-XSRF-TOKEN"))
        .andExpect(status().isOk())
        .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
        .andExpect(header().string("Access-Control-Allow-Credentials", "true"));
    mockMvc
        .perform(get("/auth/me").header("Origin", "http://localhost:5173"))
        .andExpect(status().isUnauthorized())
        .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
        .andExpect(header().string("Access-Control-Expose-Headers", "X-Trace-Id"))
        .andExpect(jsonPath("$.traceId").isNotEmpty());
  }

  @ParameterizedTest
  @CsvSource({
    "https://untrusted.example,POST,Content-Type",
    "http://localhost:5173,TRACE,Content-Type",
    "http://localhost:5173,POST,X-Unsupported"
  })
  void disallowedCorsPreflightsAreRejected(String origin, String method, String requestedHeader)
      throws Exception {
    mockMvc
        .perform(
            options("/auth/login")
                .header("Origin", origin)
                .header("Access-Control-Request-Method", method)
                .header("Access-Control-Request-Headers", requestedHeader))
        .andExpect(status().isForbidden())
        .andExpect(header().doesNotExist("Access-Control-Allow-Origin"))
        .andExpect(header().exists("X-Trace-Id"));
  }

  @Test
  void disallowedOriginCannotMakeAnActualCredentialedRequest() throws Exception {
    mockMvc
        .perform(get("/users").cookie(adminCookie()).header("Origin", "https://untrusted.example"))
        .andExpect(status().isForbidden())
        .andExpect(header().doesNotExist("Access-Control-Allow-Origin"))
        .andExpect(header().exists("X-Trace-Id"));
  }

  private MockHttpServletRequestBuilder withCsrf(MockHttpServletRequestBuilder request)
      throws Exception {
    var result = mockMvc.perform(get("/auth/csrf")).andExpect(status().isOk()).andReturn();
    Cookie cookie = result.getResponse().getCookie("XSRF-TOKEN");
    assertThat(cookie).isNotNull();
    return request.cookie(cookie).header("X-XSRF-TOKEN", cookie.getValue());
  }

  @Test
  void csrfCookieLoginMeAndLogoutFollowTheClientSessionLifecycle() throws Exception {
    MvcResult csrfResult =
        mockMvc.perform(get("/auth/csrf")).andExpect(status().isOk()).andReturn();
    Cookie csrfCookie = csrfResult.getResponse().getCookie("XSRF-TOKEN");
    String token =
        objectMapper.readTree(csrfResult.getResponse().getContentAsString()).get("token").asText();
    assertThat(csrfCookie).isNotNull();
    assertThat(csrfCookie.getValue()).isEqualTo(token);
    assertThat(csrfCookie.isHttpOnly()).isFalse();
    assertThat(csrfCookie.getSecure()).isTrue();
    MvcResult login =
        mockMvc
            .perform(
                post("/auth/login")
                    .cookie(csrfCookie)
                    .header("X-XSRF-TOKEN", token)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"username\":\"test-admin\",\"password\":\"test-password\"}"))
            .andExpect(status().isOk())
            .andExpect(cookie().httpOnly("PAPERART_SESSION", true))
            .andExpect(cookie().secure("PAPERART_SESSION", true))
            .andExpect(cookie().path("PAPERART_SESSION", "/"))
            .andExpect(jsonPath("$.token").doesNotExist())
            .andReturn();
    assertThat(login.getResponse().getHeader("Set-Cookie")).contains("SameSite=Lax");
    Cookie session = login.getResponse().getCookie("PAPERART_SESSION");
    mockMvc
        .perform(get("/auth/me").cookie(session))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.username").value("test-admin"));
    mockMvc.perform(post("/auth/logout").cookie(session)).andExpect(status().isForbidden());
    MvcResult logout =
        mockMvc
            .perform(post("/auth/logout").cookie(session, csrfCookie).header("X-XSRF-TOKEN", token))
            .andExpect(status().isNoContent())
            .andExpect(cookie().maxAge("PAPERART_SESSION", 0))
            .andExpect(cookie().value("PAPERART_SESSION", ""))
            .andExpect(cookie().httpOnly("PAPERART_SESSION", true))
            .andExpect(cookie().secure("PAPERART_SESSION", true))
            .andExpect(cookie().path("PAPERART_SESSION", "/"))
            .andReturn();
    assertThat(logout.getResponse().getHeaders("Set-Cookie"))
        .anySatisfy(
            value -> assertThat(value).startsWith("PAPERART_SESSION=").contains("SameSite=Lax"));
    // Simulate the client applying the deletion cookie; stateless JWT revocation is not implied.
    mockMvc
        .perform(get("/auth/me"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.code").value("SESSION_EXPIRED"));
    mockMvc.perform(get("/users")).andExpect(status().isUnauthorized());
  }

  @Test
  void protectedEndpointRequiresAuthentication() throws Exception {
    mockMvc
        .perform(get("/users"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.code").value("UNAUTHORIZED"))
        .andExpect(jsonPath("$.traceId").isNotEmpty());
  }

  @Test
  void loginRequiresCsrfToken() throws Exception {
    mockMvc
        .perform(
            post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                    {"username":"test-admin","password":"test-password"}
                    """))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.code").value("CSRF_INVALID"))
        .andExpect(jsonPath("$.traceId").isNotEmpty());
  }

  @Test
  void loginUsesHttpOnlyCookieWithoutReturningJwt() throws Exception {
    mockMvc
        .perform(
            withCsrf(post("/auth/login"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                    {"username":"test-admin","password":"test-password"}
                    """))
        .andExpect(status().isOk())
        .andExpect(cookie().httpOnly("PAPERART_SESSION", true))
        .andExpect(jsonPath("$.username").value("test-admin"))
        .andExpect(jsonPath("$.roles").isArray())
        .andExpect(jsonPath("$.token").doesNotExist());
  }

  @Test
  void adminCookieCanAccessAdminOnlyEndpoint() throws Exception {
    MvcResult loginResult =
        mockMvc
            .perform(
                withCsrf(post("/auth/login"))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {"username":"test-admin","password":"test-password"}
                        """))
            .andExpect(status().isOk())
            .andReturn();

    Cookie authCookie = loginResult.getResponse().getCookie("PAPERART_SESSION");

    mockMvc
        .perform(get("/users").cookie(authCookie))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray());
  }
}
