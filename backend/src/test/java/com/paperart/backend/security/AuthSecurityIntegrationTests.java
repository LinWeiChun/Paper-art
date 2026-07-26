package com.paperart.backend.security;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthSecurityIntegrationTests {

  @Autowired private MockMvc mockMvc;

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
        .andExpect(jsonPath("$.code").value("CSRF_INVALID"));
  }

  @Test
  void loginUsesHttpOnlyCookieWithoutReturningJwt() throws Exception {
    mockMvc
        .perform(
            post("/auth/login")
                .with(csrf())
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
                post("/auth/login")
                    .with(csrf())
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
