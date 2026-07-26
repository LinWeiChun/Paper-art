package com.paperart.backend.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.paperart.backend.dto.response.AuthorResponse;
import com.paperart.backend.entity.Author;
import com.paperart.backend.entity.User;
import com.paperart.backend.repository.AuthorRepository;
import com.paperart.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.support.TransactionTemplate;

@SpringBootTest
@ActiveProfiles("test")
class AuthorServiceIntegrationTests {

  @Autowired private AuthorService authorService;

  @Autowired private AuthorRepository authorRepository;

  @Autowired private UserRepository userRepository;

  @Autowired private TransactionTemplate transactionTemplate;

  @Test
  void getAllKeepsAuditUserAvailableWhileMappingResponses() {
    String username = "author-audit-test";

    transactionTemplate.executeWithoutResult(
        status -> {
          User user = new User();
          user.setUsername(username);
          user.setPassword("test-password");
          userRepository.save(user);

          Author author = new Author();
          author.setName("作者清單交易測試");
          author.setSortOrder(1);
          author.setPublished(true);
          author.setCreatedBy(user);
          author.setUpdatedBy(user);
          authorRepository.save(author);
        });

    Page<AuthorResponse> response = authorService.getAll(0, 10);

    assertThat(response.getContent()).hasSize(1);
    assertThat(response.getContent().get(0).getCreatedBy().getUsername()).isEqualTo(username);
    assertThat(response.getContent().get(0).getUpdatedBy().getUsername()).isEqualTo(username);
  }
}
