package com.paperart.backend.service;

import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.paperart.backend.entity.About;
import com.paperart.backend.entity.AboutValue;
import com.paperart.backend.entity.Art;
import com.paperart.backend.entity.Banner;
import com.paperart.backend.entity.BaseEntity;
import com.paperart.backend.entity.Category;
import com.paperart.backend.entity.Contact;
import com.paperart.backend.entity.ContactMessage;
import com.paperart.backend.entity.News;
import com.paperart.backend.entity.Tag;
import com.paperart.backend.entity.User;
import com.paperart.backend.enums.PublishStatus;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.support.TransactionTemplate;

@SpringBootTest
@ActiveProfiles("test")
class AuditTransactionIntegrationTests {

  @Autowired private AboutService aboutService;

  @Autowired private ArtService artService;

  @Autowired private BannerService bannerService;

  @Autowired private CategoryService categoryService;

  @Autowired private ContactMessageService contactMessageService;

  @Autowired private ContactService contactService;

  @Autowired private NewsService newsService;

  @Autowired private TagService tagService;

  @Autowired private UserService userService;

  @Autowired private EntityManager entityManager;

  @Autowired private TransactionTemplate transactionTemplate;

  private String managedUserId;

  @Test
  void auditedResponsesKeepLazyRelationsAvailableWhileMapping() {
    transactionTemplate.executeWithoutResult(status -> createAuditedFixtures());

    assertSoftly(
        softly -> {
          softly.assertThatCode(aboutService::getAbout).as("關於我們").doesNotThrowAnyException();
          softly
              .assertThatCode(() -> artService.getAdminAll(0, 10))
              .as("作品管理")
              .doesNotThrowAnyException();
          softly.assertThatCode(bannerService::getAll).as("首頁輪播").doesNotThrowAnyException();
          softly
              .assertThatCode(() -> categoryService.getAll(0, 10))
              .as("分類管理")
              .doesNotThrowAnyException();
          softly
              .assertThatCode(() -> contactMessageService.getAll(0, 10))
              .as("聯絡表單")
              .doesNotThrowAnyException();
          softly.assertThatCode(contactService::getContact).as("聯絡資訊").doesNotThrowAnyException();
          softly
              .assertThatCode(() -> newsService.getAllAdminNews(0, 10))
              .as("最新消息")
              .doesNotThrowAnyException();
          softly
              .assertThatCode(() -> tagService.getAll(0, 10))
              .as("標籤管理")
              .doesNotThrowAnyException();
          softly
              .assertThatCode(() -> userService.getUserById(managedUserId))
              .as("使用者管理")
              .doesNotThrowAnyException();
        });
  }

  private void createAuditedFixtures() {
    User auditUser = new User();
    auditUser.setUsername("audit-transaction-user");
    auditUser.setPassword("test-password");
    entityManager.persist(auditUser);

    User managedUser = new User();
    managedUser.setUsername("audit-managed-user");
    managedUser.setPassword("test-password");
    markAudited(managedUser, auditUser);
    entityManager.persist(managedUser);
    managedUserId = managedUser.getId();

    Category category = new Category();
    category.setName("交易測試分類");
    category.setSortOrder(1);
    markAudited(category, auditUser);
    entityManager.persist(category);

    Tag tag = new Tag();
    tag.setName("交易測試標籤");
    markAudited(tag, auditUser);
    entityManager.persist(tag);

    Banner banner = new Banner();
    banner.setTitle("交易測試輪播");
    banner.setImage("https://example.com/banner.jpg");
    markAudited(banner, auditUser);
    entityManager.persist(banner);

    News news = new News();
    news.setTitle("交易測試消息");
    news.setCoverImage("https://example.com/news.jpg");
    news.setStatus(PublishStatus.PUBLISHED);
    markAudited(news, auditUser);
    entityManager.persist(news);

    About about = new About();
    about.setBannerTitle("交易測試關於我們");
    markAudited(about, auditUser);

    AboutValue aboutValue = new AboutValue();
    aboutValue.setTitle("交易測試價值");
    aboutValue.setSortOrder(1);
    aboutValue.setAbout(about);
    markAudited(aboutValue, auditUser);
    about.getValues().add(aboutValue);
    entityManager.persist(about);

    Contact contact = new Contact();
    contact.setContactPerson("交易測試聯絡人");
    markAudited(contact, auditUser);
    entityManager.persist(contact);

    ContactMessage contactMessage = new ContactMessage();
    contactMessage.setName("交易測試訪客");
    contactMessage.setEmail("visitor@example.com");
    contactMessage.setSubject("交易測試主旨");
    contactMessage.setMessage("交易測試內容");
    markAudited(contactMessage, auditUser);
    entityManager.persist(contactMessage);

    Art art = new Art();
    art.setTitle("交易測試作品");
    art.setSortOrder(1);
    markAudited(art, auditUser);
    entityManager.persist(art);
  }

  private void markAudited(BaseEntity entity, User auditUser) {
    entity.setCreatedBy(auditUser);
    entity.setUpdatedBy(auditUser);
  }
}
