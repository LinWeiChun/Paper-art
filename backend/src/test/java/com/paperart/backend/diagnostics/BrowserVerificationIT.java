package com.paperart.backend.diagnostics;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verifyNoInteractions;

import com.paperart.backend.scheduler.R2CleanupScheduler;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import javax.sql.DataSource;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import software.amazon.awssdk.services.s3.S3Client;

/** Opt-in local browser fixture. This server harness does not assert browser acceptance. */
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT,
    properties = {
      "server.address=127.0.0.1",
      "server.port=33317",
      "server.tomcat.accesslog.enabled=true",
      "server.tomcat.accesslog.directory=${user.dir}/target/browser-accesslog",
      "server.tomcat.accesslog.pattern=%t %r %s %{X-Trace-Id}o",
      "spring.datasource.url=jdbc:h2:mem:paperart_browser;MODE=MySQL;DB_CLOSE_DELAY=-1;DATABASE_TO_LOWER=TRUE;NON_KEYWORDS=YEAR",
      "spring.datasource.driver-class-name=org.h2.Driver",
      "spring.datasource.username=sa",
      "spring.datasource.password=",
      "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
      "spring.jpa.hibernate.ddl-auto=create-drop",
      "cloudflare.r2.endpoint=http://127.0.0.1:1",
      "cloudflare.r2.public-url=http://127.0.0.1:1/browser",
      "cloudflare.r2.access-key=browser-test-only",
      "cloudflare.r2.secret-key=browser-test-only",
      "cloudflare.r2.bucket=browser-test-only",
      "app.cors.allowed-origins=http://localhost:5173,http://localhost:5174",
      "jwt.cookie-secure=false",
      "csrf.cookie-secure=false",
      "admin.username=browser-admin",
      "admin.password=browser-local-only"
    })
@ActiveProfiles("test")
@EnabledIfSystemProperty(named = "paperart.browser", matches = "true")
class BrowserVerificationIT {
  @Autowired private DataSource dataSource;
  @Autowired private JdbcTemplate jdbc;
  @MockitoBean private S3Client s3Client;
  @MockitoBean private R2CleanupScheduler cleanupScheduler;

  @Test
  void serveIsolatedFixtureUntilStopped() throws Exception {
    try (var connection = dataSource.getConnection()) {
      assertThat(connection.getMetaData().getURL()).isEqualTo("jdbc:h2:mem:paperart_browser");
    }
    jdbc.update(
        "insert into authors (id,name,sort_order,published,deleted,created_at,updated_at) values ('00000000-0000-4000-8000-000000000101','測試作者',0,true,false,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)");
    jdbc.update(
        "insert into categories (id,name,sort_order,published,deleted,created_at,updated_at) values ('00000000-0000-4000-8000-000000000201','測試分類',0,true,false,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)");
    for (int i = 1; i <= 3; i++) {
      String id = "00000000-0000-4000-8000-%012d".formatted(i);
      jdbc.update(
          "insert into arts (id,title,art_number,sort_order,year,featured,rentable,published,deleted,created_at,updated_at) values (?,?,?,0,2026,false,true,?,false,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)",
          id,
          i == 1 ? "春花" : i == 2 ? "春鳥" : "草稿作品",
          "BROWSER-" + i,
          i != 3);
      jdbc.update(
          "insert into art_authors (art_id,author_id) values (?,'00000000-0000-4000-8000-000000000101')",
          id);
      jdbc.update(
          "insert into art_categories (art_id,category_id) values (?,'00000000-0000-4000-8000-000000000201')",
          id);
    }
    Path ready = Path.of("target/browser-verification.ready");
    Path stop = Path.of("target/browser-verification.stop");
    Files.deleteIfExists(stop);
    Files.writeString(ready, "http://localhost:33317/paper/api; H2 paperart_browser");
    try {
      long deadline = System.nanoTime() + Duration.ofMinutes(20).toNanos();
      while (!Files.exists(stop) && System.nanoTime() < deadline) {
        Thread.sleep(250);
      }
      assertThat(Files.exists(stop))
          .as("Browser operator must explicitly stop the fixture")
          .isTrue();
      verifyNoInteractions(s3Client);
      verifyNoInteractions(cleanupScheduler);
    } finally {
      Files.deleteIfExists(ready);
      Files.deleteIfExists(stop);
    }
  }
}
