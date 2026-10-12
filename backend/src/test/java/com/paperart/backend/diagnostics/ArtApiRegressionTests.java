package com.paperart.backend.diagnostics;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.paperart.backend.scheduler.R2CleanupScheduler;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import javax.sql.DataSource;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInfo;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import software.amazon.awssdk.services.s3.S3Client;

/** Search and visibility regression suite, included in the default Maven test lifecycle. */
@SpringBootTest(
    properties = {
      "spring.datasource.url=jdbc:h2:mem:paperart_m1_diagnostics;MODE=MySQL;DB_CLOSE_DELAY=-1;DATABASE_TO_LOWER=TRUE;NON_KEYWORDS=YEAR",
      "spring.datasource.driver-class-name=org.h2.Driver",
      "spring.datasource.username=sa",
      "spring.datasource.password=",
      "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
      "spring.jpa.hibernate.ddl-auto=create-drop",
      "cloudflare.r2.endpoint=http://127.0.0.1:1",
      "cloudflare.r2.public-url=http://127.0.0.1:1/m1",
      "cloudflare.r2.access-key=m1-test-only",
      "cloudflare.r2.secret-key=m1-test-only",
      "cloudflare.r2.bucket=m1-test-only"
    })
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ArtApiRegressionTests {

  @Autowired private MockMvc mockMvc;
  @Autowired private JdbcTemplate jdbc;
  @Autowired private DataSource dataSource;
  @MockitoBean private S3Client s3Client;
  @MockitoBean private R2CleanupScheduler cleanupScheduler;

  private static String id(int value) {
    return "00000000-0000-4000-8000-%012d".formatted(value);
  }

  @BeforeEach
  void createIsolatedFixture(TestInfo testInfo) throws Exception {
    try (var connection = dataSource.getConnection()) {
      String expectedUrl =
          getClass() == ArtApiMysqlIT.class
              ? ArtApiMysqlIT.URL
              : "jdbc:h2:mem:paperart_m1_diagnostics";
      assertThat(connection.getMetaData().getURL()).startsWith(expectedUrl);
    }
    // The database belongs only to this test context. Do not run inside a test transaction:
    // keeping one open would mask lazy-loading failures across the controller/service boundary.
    jdbc.batchUpdate(
        "delete from art_tags",
        "delete from art_authors",
        "delete from art_categories",
        "delete from arts",
        "delete from authors",
        "delete from categories",
        "delete from tags");
    if (testInfo.getTestMethod().orElseThrow().getName().equals("invalidInputsShouldReturn400")) {
      return;
    }
    for (int index = 1; index <= 2; index++) {
      LocalDateTime date = LocalDateTime.of(2026, 1, index, 0, 0);
      jdbc.update(
          "insert into authors (id,name,sort_order,published,deleted,created_at,updated_at) values (?,?,?,true,false,?,?)",
          id(100 + index),
          "Author " + index,
          index,
          date,
          date);
      jdbc.update(
          "insert into categories (id,name,sort_order,published,deleted,created_at,updated_at) values (?,?,?,true,false,?,?)",
          id(200 + index),
          "Category " + index,
          index,
          date,
          date);
      jdbc.update(
          "insert into tags (id,name,published,deleted,created_at,updated_at) values (?,?,true,false,?,?)",
          id(300 + index),
          "Tag " + index,
          date,
          date);
    }
    String[] titles = {"春花", "春鳥", "山景", "草稿", "已刪除", "未配作者"};
    for (int index = 1; index <= 6; index++) {
      LocalDateTime date = LocalDateTime.of(2026, 1, index >= 3 ? index - 1 : index, 0, 0);
      jdbc.update(
          "insert into arts (id,title,art_number,sort_order,year,featured,rentable,published,deleted,created_at,updated_at) values (?,?,?,?,?,?,?,?,?,?,?)",
          id(index),
          titles[index - 1],
          "QA-%03d".formatted(index),
          index >= 3 ? (index - 1) * 10 : index * 10,
          index == 1 ? 2020 : index <= 3 ? 2021 : index <= 5 ? 2022 : 2023,
          index == 1 || index == 3,
          index != 3,
          index != 4,
          index == 5,
          date,
          date);
      if (index != 6) {
        jdbc.update(
            "insert into art_authors (art_id,author_id) values (?,?)",
            id(index),
            id(index == 2 ? 102 : 101));
      }
      jdbc.update(
          "insert into art_categories (art_id,category_id) values (?,?)",
          id(index),
          id(index == 2 ? 202 : 201));
      if (index != 6) {
        jdbc.update(
            "insert into art_tags (art_id,tag_id) values (?,?)",
            id(index),
            id(index == 2 ? 302 : 301));
      }
    }
    jdbc.update("insert into art_authors (art_id,author_id) values (?,?)", id(3), id(102));
    jdbc.update("insert into art_categories (art_id,category_id) values (?,?)", id(3), id(202));
    jdbc.update("insert into art_tags (art_id,tag_id) values (?,?)", id(3), id(302));
  }

  @AfterEach
  void neverAccessObjectStorage() {
    verifyNoInteractions(s3Client);
  }

  @Test
  void publicSearchKeywordFiltersAndPagination() throws Exception {
    mockMvc
        .perform(
            post("/arts/search").with(csrf()).contentType(MediaType.APPLICATION_JSON).content("{}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.totalElements").value(3))
        .andExpect(jsonPath("$.content[*].id").value(containsInAnyOrder(id(1), id(2), id(3))));
    mockMvc
        .perform(
            post("/arts/search")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"keyword\":\"春\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content[*].id").value(containsInAnyOrder(id(1), id(2))));
    mockMvc
        .perform(
            post("/arts/search")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"keyword\":\"不存在詞\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.totalElements").value(0));
    String combined =
        "{\"authorIds\":[\"%s\"],\"categoryIds\":[\"%s\"],\"tagIds\":[\"%s\"]}"
            .formatted(id(101), id(202), id(301));
    mockMvc
        .perform(
            post("/arts/search")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(combined))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.totalElements").value(1))
        .andExpect(jsonPath("$.content[0].id").value(id(3)));
    for (int page = 0; page < 2; page++) {
      mockMvc
          .perform(
              post("/arts/search?page=" + page + "&size=2")
                  .with(csrf())
                  .contentType(MediaType.APPLICATION_JSON)
                  .content("{}"))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.totalElements").value(3))
          .andExpect(jsonPath("$.totalPages").value(2))
          .andExpect(jsonPath("$.content.length()").value(page == 0 ? 2 : 1));
    }
  }

  @Test
  void publicDetailDistinguishesVisibleHiddenAndMissingWorks() throws Exception {
    for (int work = 1; work <= 3; work++) {
      mockMvc
          .perform(get("/arts/" + id(work)))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.id").value(id(work)));
    }
    for (int work : new int[] {4, 5, 6, 999}) {
      mockMvc
          .perform(get("/arts/" + id(work)))
          .andExpect(status().isNotFound())
          .andExpect(jsonPath("$.code").value("ART_NOT_FOUND"))
          .andExpect(jsonPath("$.traceId").isNotEmpty());
    }
    jdbc.update("update authors set published=false where id=?", id(101));
    mockMvc.perform(get("/arts/" + id(1))).andExpect(status().isNotFound());
    mockMvc.perform(get("/arts/" + id(3))).andExpect(status().isOk());
  }

  @Test
  void publicSearchRequiresCsrfAndAdminDetailRequiresAuthentication() throws Exception {
    mockMvc
        .perform(post("/arts/search").contentType(MediaType.APPLICATION_JSON).content("{}"))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.code").value("CSRF_INVALID"));
    mockMvc.perform(get("/arts/admin/" + id(1))).andExpect(status().isUnauthorized());
  }

  static Stream<Arguments> invalidSearchRequests() {
    return Stream.of(
        Arguments.of("negative-page", "?page=-1", "{}"),
        Arguments.of("zero-size", "?size=0", "{}"),
        Arguments.of("non-numeric-page", "?page=abc", "{}"),
        Arguments.of("non-numeric-size", "?size=abc", "{}"),
        Arguments.of("missing-body", "", ""),
        Arguments.of("malformed-json", "", "{"),
        Arguments.of("invalid-boolean", "", "{\"featured\":\"bad\"}"),
        Arguments.of("size-limit", "?size=101", "{}"),
        Arguments.of("keyword-limit", "", "{\"keyword\":\"" + "a".repeat(201) + "\"}"));
  }

  @ParameterizedTest(name = "{0}")
  @MethodSource("invalidSearchRequests")
  void invalidInputsShouldReturn400(String scenario, String query, String body) throws Exception {
    MvcResult result =
        mockMvc
            .perform(
                post("/arts/search" + query)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(body))
            .andExpect(jsonPath("$.status").value(400))
            .andExpect(
                jsonPath("$.code")
                    .value(
                        scenario.equals("keyword-limit") ? "VALIDATION_FAILED" : "INVALID_REQUEST"))
            .andExpect(jsonPath("$.path").value("/arts/search"))
            .andExpect(jsonPath("$.timestamp").isNotEmpty())
            .andExpect(jsonPath("$.traceId").isNotEmpty())
            .andExpect(jsonPath("$.exception").doesNotExist())
            .andExpect(jsonPath("$.stackTrace").doesNotExist())
            .andExpect(
                resultMatcher ->
                    assertThat(resultMatcher.getResponse().getContentAsString())
                        .doesNotContain("java.", "org.springframework.", "SELECT", "com.paperart."))
            .andExpect(
                resultMatcher ->
                    jsonPath("$.traceId")
                        .value(resultMatcher.getResponse().getHeader("X-Trace-Id"))
                        .match(resultMatcher))
            .andReturn();
    assertThat(result.getResponse().getStatus()).as(scenario).isEqualTo(400);
  }

  @Test
  void maximumKeywordAndPageSizeAreAccepted() throws Exception {
    String keyword = "春".repeat(200);
    jdbc.update("update arts set description=? where id=?", keyword, id(1));
    mockMvc
        .perform(
            post("/arts/search?page=0&size=100")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"keyword\":\"" + keyword + "\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.size").value(100))
        .andExpect(jsonPath("$.totalElements").value(1))
        .andExpect(jsonPath("$.content[0].id").value(id(1)));
  }

  @ParameterizedTest
  @CsvSource({
    "{},false",
    "{\"sort\":\"sortOrder\"},false",
    "{\"sort\":\"oldest\"},false",
    "{\"sort\":\"newest\"},true",
    "{\"sort\":\"yearAsc\"},false",
    "{\"sort\":\"yearDesc\"},true",
    "{\"sort\":\"titleAsc\"},false",
    "{\"sort\":\"titleDesc\"},true",
    "{\"sort\":\"unknown\"},false"
  })
  void tiedSortValuesUseAscendingIdAcrossPages(String body, boolean descending) throws Exception {
    jdbc.update(
        "update arts set title='A',sort_order=20,year=2021,created_at=?",
        LocalDateTime.of(2026, 1, 1, 0, 0));
    jdbc.update(
        "update arts set title='Z',sort_order=99,year=2022,created_at=? where id=?",
        LocalDateTime.of(2027, 1, 1, 0, 0),
        id(1));
    int[] expected = descending ? new int[] {1, 2, 3} : new int[] {2, 3, 1};
    for (int page = 0; page < 4; page++) {
      var result =
          mockMvc
              .perform(
                  post("/arts/search?page=" + page + "&size=1")
                      .with(csrf())
                      .contentType(MediaType.APPLICATION_JSON)
                      .content(body))
              .andExpect(status().isOk())
              .andExpect(jsonPath("$.totalElements").value(3))
              .andExpect(jsonPath("$.totalPages").value(3));
      if (page < 3) {
        result
            .andExpect(jsonPath("$.content.length()").value(1))
            .andExpect(jsonPath("$.content[0].id").value(id(expected[page])));
      } else {
        result.andExpect(jsonPath("$.content.length()").value(0));
      }
    }
  }
}
