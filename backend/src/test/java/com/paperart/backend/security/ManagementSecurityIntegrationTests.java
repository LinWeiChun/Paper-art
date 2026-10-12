package com.paperart.backend.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.paperart.backend.scheduler.R2CleanupScheduler;
import jakarta.servlet.http.Cookie;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;
import software.amazon.awssdk.services.s3.model.S3Exception;

/**
 * API regression at real security/controller/service boundaries; only external storage is mocked.
 */
@SpringBootTest(
    properties = {
      "spring.datasource.url=jdbc:h2:mem:paperart_m2_management;MODE=MySQL;DB_CLOSE_DELAY=-1;DATABASE_TO_LOWER=TRUE;NON_KEYWORDS=YEAR",
      "cloudflare.r2.endpoint=http://127.0.0.1:1",
      "cloudflare.r2.public-url=http://127.0.0.1:1/test"
    })
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ManagementSecurityIntegrationTests {
  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper objectMapper;
  @MockitoBean private S3Client s3Client;
  @MockitoBean private R2CleanupScheduler cleanupScheduler;

  private MockHttpServletRequestBuilder withCsrf(MockHttpServletRequestBuilder request)
      throws Exception {
    Cookie csrf =
        mockMvc
            .perform(get("/auth/csrf"))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getCookie("XSRF-TOKEN");
    assertThat(csrf).isNotNull();
    return request.cookie(csrf).header("X-XSRF-TOKEN", csrf.getValue());
  }

  private Cookie login(String username, String password) throws Exception {
    return mockMvc
        .perform(
            withCsrf(post("/auth/login"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    objectMapper.writeValueAsString(
                        Map.of("username", username, "password", password))))
        .andExpect(status().isOk())
        .andReturn()
        .getResponse()
        .getCookie("PAPERART_SESSION");
  }

  private Cookie roleCookie(String role) throws Exception {
    Cookie admin = login("test-admin", "test-password");
    if (role.equals("ADMIN")) {
      return admin;
    }
    String username = "management-" + UUID.randomUUID();
    mockMvc
        .perform(
            withCsrf(post("/users"))
                .cookie(admin)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    objectMapper.writeValueAsString(
                        Map.of(
                            "username",
                            username,
                            "password",
                            "test-password",
                            "roles",
                            List.of(role)))))
        .andExpect(status().isOk());
    return login(username, "test-password");
  }

  private MockMultipartFile data(Object value) throws Exception {
    return new MockMultipartFile(
        "data", "", "application/json", objectMapper.writeValueAsBytes(value));
  }

  private JsonNode json(MvcResult result) throws Exception {
    return objectMapper.readTree(result.getResponse().getContentAsString());
  }

  @Test
  void authorizedCrudPreservesVisibilityAndReturnsSavedChanges() throws Exception {
    Cookie admin = roleCookie("ADMIN");
    Cookie authorManager = roleCookie("AUTHOR_MANAGE");
    Cookie categoryManager = roleCookie("CATEGORY_MANAGE");
    Cookie artManager = roleCookie("ART_MANAGE");
    String authorId =
        json(mockMvc
                .perform(
                    withCsrf(
                            multipart("/authors")
                                .file(data(Map.of("name", "回歸作者", "published", true))))
                        .cookie(authorManager))
                .andExpect(status().isOk())
                .andReturn())
            .get("id")
            .asText();
    String categoryId =
        json(mockMvc
                .perform(
                    withCsrf(post("/categories"))
                        .cookie(categoryManager)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"回歸分類\",\"published\":true}"))
                .andExpect(status().isOk())
                .andReturn())
            .get("id")
            .asText();
    Map<String, Object> art =
        new java.util.LinkedHashMap<>(
            Map.of(
                "title",
                "回歸作品",
                "artNumber",
                UUID.randomUUID().toString(),
                "published",
                true,
                "featured",
                false,
                "rentable",
                true,
                "authorIds",
                List.of(authorId),
                "categoryIds",
                List.of(categoryId)));
    String artId =
        json(mockMvc
                .perform(withCsrf(multipart("/arts").file(data(art))).cookie(artManager))
                .andExpect(status().isOk())
                .andReturn())
            .get("id")
            .asText();
    mockMvc
        .perform(get("/arts/" + artId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.title").value("回歸作品"));
    art.put("title", "已修改作品");
    mockMvc
        .perform(
            withCsrf(multipart(HttpMethod.PUT, "/arts/" + artId).file(data(art)))
                .cookie(artManager))
        .andExpect(status().isOk());
    mockMvc
        .perform(get("/arts/" + artId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.title").value("已修改作品"));
    art.put("published", false);
    mockMvc
        .perform(
            withCsrf(multipart(HttpMethod.PUT, "/arts/" + artId).file(data(art)))
                .cookie(artManager))
        .andExpect(status().isOk());
    mockMvc.perform(get("/arts/" + artId)).andExpect(status().isNotFound());
    mockMvc.perform(get("/arts/admin/" + artId).cookie(artManager)).andExpect(status().isOk());
    mockMvc
        .perform(withCsrf(delete("/arts/" + artId)).cookie(artManager))
        .andExpect(status().isOk());
    mockMvc.perform(get("/arts/admin/" + artId).cookie(admin)).andExpect(status().isNotFound());
    mockMvc
        .perform(
            withCsrf(
                    multipart(HttpMethod.PUT, "/authors/" + authorId)
                        .file(data(Map.of("name", "已修改作者", "published", true, "sortOrder", 0))))
                .cookie(authorManager))
        .andExpect(status().isOk());
    mockMvc
        .perform(get("/authors/" + authorId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("已修改作者"));
    mockMvc
        .perform(
            withCsrf(put("/categories/" + categoryId))
                .cookie(categoryManager)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"已修改分類\",\"published\":true,\"sortOrder\":0}"))
        .andExpect(status().isOk());
    mockMvc
        .perform(get("/categories/" + categoryId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("已修改分類"));
    mockMvc
        .perform(withCsrf(delete("/authors/" + authorId)).cookie(authorManager))
        .andExpect(status().isOk());
    mockMvc
        .perform(withCsrf(delete("/categories/" + categoryId)).cookie(categoryManager))
        .andExpect(status().isNoContent());
    mockMvc
        .perform(get("/authors/admin/" + authorId).cookie(admin))
        .andExpect(status().isNotFound());
    mockMvc
        .perform(get("/categories/admin/" + categoryId).cookie(admin))
        .andExpect(status().isNotFound());
    verifyNoInteractions(s3Client);
  }

  @ParameterizedTest
  @ValueSource(strings = {"/arts", "/authors", "/categories"})
  void malformedManagementJsonIs400OnlyAfterAuthorization(String path) throws Exception {
    Cookie admin = roleCookie("ADMIN");
    MockHttpServletRequestBuilder request =
        path.equals("/categories")
            ? post(path).contentType(MediaType.APPLICATION_JSON).content("{")
            : multipart(path)
                .file(
                    new MockMultipartFile(
                        "data", "", "application/json", "{".getBytes(StandardCharsets.UTF_8)));
    mockMvc
        .perform(withCsrf(request).cookie(admin))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("INVALID_REQUEST"))
        .andExpect(jsonPath("$.traceId").isNotEmpty());
    Cookie other = roleCookie(path.equals("/authors") ? "ART_MANAGE" : "AUTHOR_MANAGE");
    MockHttpServletRequestBuilder unauthorized =
        path.equals("/categories")
            ? post(path).contentType(MediaType.APPLICATION_JSON).content("{")
            : multipart(path)
                .file(
                    new MockMultipartFile(
                        "data", "", "application/json", "{".getBytes(StandardCharsets.UTF_8)));
    mockMvc
        .perform(withCsrf(unauthorized).cookie(other))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.code").value("FORBIDDEN"));
    verifyNoInteractions(s3Client);
  }

  @Test
  void uploadRequiresCsrfAndPermissionThenReturnsTheStoredImageLocation() throws Exception {
    MockMultipartFile image =
        new MockMultipartFile(
            "image",
            "sample.png",
            "image/png",
            Base64.getDecoder()
                .decode(
                    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII="));
    Cookie artManager = roleCookie("ART_MANAGE");
    mockMvc
        .perform(multipart("/upload/arts").file(image).cookie(artManager))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.code").value("CSRF_INVALID"));
    mockMvc
        .perform(withCsrf(multipart("/upload/arts").file(image)))
        .andExpect(status().isUnauthorized());
    mockMvc
        .perform(
            withCsrf(multipart("/upload/arts").file(image)).cookie(roleCookie("CATEGORY_MANAGE")))
        .andExpect(status().isForbidden());
    verifyNoInteractions(s3Client);
    when(s3Client.putObject(any(PutObjectRequest.class), any(RequestBody.class)))
        .thenReturn(PutObjectResponse.builder().build());
    var uploaded =
        json(
            mockMvc
                .perform(withCsrf(multipart("/upload/arts").file(image)).cookie(artManager))
                .andExpect(status().isOk())
                .andReturn());
    assertThat(uploaded.get("key").asText()).startsWith("arts/").endsWith(".png");
    assertThat(uploaded.get("url").asText())
        .isEqualTo("http://127.0.0.1:1/test/" + uploaded.get("key").asText());
  }

  @Test
  void storageFailureRemains500WithoutExposingTheStorageException() throws Exception {
    Cookie admin = roleCookie("ADMIN");
    when(s3Client.putObject(any(PutObjectRequest.class), any(RequestBody.class)))
        .thenThrow(S3Exception.builder().statusCode(503).message("private-storage-detail").build());
    var result =
        mockMvc
            .perform(
                withCsrf(
                        multipart("/upload/arts")
                            .file(
                                new MockMultipartFile(
                                    "image", "sample.png", "image/png", new byte[] {1})))
                    .cookie(admin))
            .andExpect(status().isInternalServerError())
            .andExpect(jsonPath("$.code").value("INTERNAL_ERROR"))
            .andExpect(jsonPath("$.traceId").isNotEmpty())
            .andReturn();
    assertThat(result.getResponse().getContentAsString())
        .doesNotContain("private-storage-detail", "S3Exception", "stackTrace");
  }

  @Test
  void importHonorsPermissionAndPersistsAnUnpublishedToVisitorsWorkWithoutAuthor()
      throws Exception {
    String artNumber = "import-" + UUID.randomUUID();
    byte[] bytes;
    try (var workbook = new XSSFWorkbook();
        var output = new ByteArrayOutputStream()) {
      var sheet = workbook.createSheet("回歸子分類");
      var row = sheet.createRow(2);
      row.createCell(0).setCellValue(artNumber);
      row.createCell(1).setCellValue("回歸匯入作品");
      workbook.write(output);
      bytes = output.toByteArray();
    }
    MockMultipartFile file =
        new MockMultipartFile(
            "file",
            "回歸主分類.xlsx",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            bytes);
    Cookie artManager = roleCookie("ART_MANAGE");
    mockMvc
        .perform(multipart("/arts/import").file(file).cookie(artManager))
        .andExpect(status().isForbidden());
    mockMvc
        .perform(withCsrf(multipart("/arts/import").file(file)))
        .andExpect(status().isUnauthorized());
    mockMvc
        .perform(withCsrf(multipart("/arts/import").file(file)).cookie(roleCookie("AUTHOR_MANAGE")))
        .andExpect(status().isForbidden());
    mockMvc
        .perform(withCsrf(multipart("/arts/import").file(file)).cookie(artManager))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.createdCount").value(1))
        .andExpect(jsonPath("$.skippedCount").value(0))
        .andExpect(jsonPath("$.failedCount").value(0));
    var listing =
        json(
            mockMvc
                .perform(get("/arts/admin?size=100").cookie(artManager))
                .andExpect(status().isOk())
                .andReturn());
    String importedId = null;
    for (JsonNode art : listing.get("content")) {
      if (artNumber.equals(art.get("artNumber").asText())) {
        importedId = art.get("id").asText();
      }
    }
    assertThat(importedId).isNotNull();
    mockMvc.perform(get("/arts/" + importedId)).andExpect(status().isNotFound());
    mockMvc
        .perform(
            withCsrf(post("/arts/search"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("keyword", artNumber))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.totalElements").value(0));
    mockMvc
        .perform(withCsrf(multipart("/arts/import").file(file)).cookie(artManager))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.createdCount").value(0))
        .andExpect(jsonPath("$.skippedCount").value(1));
    verifyNoInteractions(s3Client);
  }
}
