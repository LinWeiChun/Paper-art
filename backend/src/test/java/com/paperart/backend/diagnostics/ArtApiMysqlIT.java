package com.paperart.backend.diagnostics;

import org.springframework.boot.test.context.SpringBootTest;

/** Run with -Dtest=ArtApiMysqlIT against the disposable local MySQL in docs/M2_01_EXECUTION.md. */
@SpringBootTest(
    properties = {
      "spring.datasource.url=" + ArtApiMysqlIT.URL,
      "spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver",
      "spring.datasource.username=m1",
      "spring.datasource.password=m1-local-only",
      "spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect",
      "spring.jpa.hibernate.ddl-auto=create-drop",
      "cloudflare.r2.endpoint=http://127.0.0.1:1",
      "cloudflare.r2.public-url=http://127.0.0.1:1/m1",
      "cloudflare.r2.access-key=m1-test-only",
      "cloudflare.r2.secret-key=m1-test-only",
      "cloudflare.r2.bucket=m1-test-only"
    })
class ArtApiMysqlIT extends ArtApiRegressionTests {
  static final String URL =
      "jdbc:mysql://127.0.0.1:33316/paperart_m1?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
}
