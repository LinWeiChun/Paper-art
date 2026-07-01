package com.paperart.backend.service.impl;

import com.paperart.backend.dto.response.R2CleanupResponse;
import com.paperart.backend.entity.About;
import com.paperart.backend.entity.AboutValue;
import com.paperart.backend.entity.Art;
import com.paperart.backend.entity.Author;
import com.paperart.backend.entity.AutomationExecutionLog;
import com.paperart.backend.entity.Banner;
import com.paperart.backend.entity.News;
import com.paperart.backend.repository.AboutRepository;
import com.paperart.backend.repository.ArtRepository;
import com.paperart.backend.repository.AuthorRepository;
import com.paperart.backend.repository.BannerRepository;
import com.paperart.backend.repository.NewsRepository;
import com.paperart.backend.service.AutomationExecutionLogService;
import com.paperart.backend.service.FileUploadService;
import com.paperart.backend.service.R2CleanupService;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class R2CleanupServiceImpl implements R2CleanupService {

  private final FileUploadService fileUploadService;
  private final ArtRepository artRepository;
  private final AuthorRepository authorRepository;
  private final BannerRepository bannerRepository;
  private final NewsRepository newsRepository;
  private final AboutRepository aboutRepository;
  private final AutomationExecutionLogService automationExecutionLogService;

  @Value("${cloudflare.r2.public-url}")
  private String publicUrl;

  @Override
  @Transactional
  public R2CleanupResponse moveUnusedFilesToDeleteFolder(boolean dryRun) {
    return moveUnusedFilesToDeleteFolder(dryRun, "MANUAL");
  }

  @Override
  @Transactional
  public R2CleanupResponse moveUnusedFilesToDeleteFolder(boolean dryRun, String triggerType) {
    AutomationExecutionLog log =
        automationExecutionLogService.start(
            "R2_UNUSED_FILE_CLEANUP",
            "R2 未使用檔案清理",
            "R2_MAINTENANCE",
            triggerType,
            Map.of("dryRun", dryRun),
            Map.of("startedBy", triggerType, "startedAt", LocalDateTime.now().toString()));

    try {
      R2CleanupResponse response = cleanupUnusedFiles(dryRun);
      automationExecutionLogService.markSuccess(log, response);
      return response;
    } catch (RuntimeException e) {
      automationExecutionLogService.markFailed(log, e);
      throw e;
    }
  }

  private R2CleanupResponse cleanupUnusedFiles(boolean dryRun) {
    Set<String> usedKeys = collectUsedKeys();
    List<String> allKeys = fileUploadService.listAllKeys();
    List<String> movedKeys = new ArrayList<>();
    List<String> skippedKeys = new ArrayList<>();

    for (String key : allKeys) {
      if (shouldSkip(key)) {
        skippedKeys.add(key);
        continue;
      }

      if (!usedKeys.contains(key)) {
        movedKeys.add(key);

        if (!dryRun) {
          fileUploadService.moveToDeleteFolder(key);
        }
      }
    }

    return R2CleanupResponse.builder()
        .scannedCount(allKeys.size())
        .usedCount(usedKeys.size())
        .movedCount(movedKeys.size())
        .skippedCount(skippedKeys.size())
        .dryRun(dryRun)
        .movedKeys(movedKeys)
        .skippedKeys(skippedKeys)
        .build();
  }

  private Set<String> collectUsedKeys() {
    Set<String> usedKeys = new HashSet<>();

    artRepository.findAll().stream()
        .filter(art -> !isDeleted(art))
        .forEach(
            art -> {
              addKey(usedKeys, art.getThumbnail());
              addKeysFromText(usedKeys, art.getDescription());
            });

    authorRepository.findAll().stream()
        .filter(author -> !isDeleted(author))
        .forEach(
            author -> {
              addKey(usedKeys, author.getAvatarUrl());
              addKeysFromText(usedKeys, author.getDescription());
            });

    bannerRepository.findAll().stream()
        .filter(banner -> !isDeleted(banner))
        .forEach(banner -> addKey(usedKeys, banner.getImage()));

    newsRepository.findAll().stream()
        .filter(news -> !isDeleted(news))
        .forEach(
            news -> {
              addKey(usedKeys, news.getCoverImage());
              addKeysFromText(usedKeys, news.getSummary());
              addKeysFromText(usedKeys, news.getContent());
            });

    aboutRepository.findAll().stream()
        .filter(about -> !isDeleted(about))
        .forEach(
            about -> {
              addKeysFromText(usedKeys, about.getStoryContent());
              addKeysFromText(usedKeys, about.getVision());
              about.getValues().stream()
                  .filter(value -> !isDeleted(value))
                  .forEach(value -> addKeysFromText(usedKeys, value.getDescription()));
            });

    return usedKeys;
  }

  private void addKey(Set<String> usedKeys, String fileUrlOrKey) {
    String key = extractKey(fileUrlOrKey);

    if (key != null && !key.isBlank()) {
      usedKeys.add(key);
    }
  }

  private void addKeysFromText(Set<String> usedKeys, String text) {
    if (text == null || text.isBlank()) {
      return;
    }

    Pattern pattern = Pattern.compile(Pattern.quote(publicUrl + "/") + "([^\"'<>\\s)]+)");
    Matcher matcher = pattern.matcher(text);

    while (matcher.find()) {
      addKey(usedKeys, publicUrl + "/" + matcher.group(1));
    }
  }

  private String extractKey(String fileUrlOrKey) {
    if (fileUrlOrKey == null || fileUrlOrKey.isBlank()) {
      return null;
    }

    if (fileUrlOrKey.startsWith(publicUrl + "/")) {
      String key = fileUrlOrKey.substring((publicUrl + "/").length());
      return URLDecoder.decode(key, StandardCharsets.UTF_8);
    }

    if (fileUrlOrKey.startsWith("http://") || fileUrlOrKey.startsWith("https://")) {
      return null;
    }

    return fileUrlOrKey;
  }

  private boolean shouldSkip(String key) {
    return key == null
        || key.isBlank()
        || key.endsWith("/")
        || key.startsWith("delete/")
        || key.startsWith("editor/")
        || key.startsWith("editor-images/")
        || key.startsWith("ckeditor/");
  }

  private boolean isDeleted(Art art) {
    return Boolean.TRUE.equals(art.getDeleted());
  }

  private boolean isDeleted(Author author) {
    return Boolean.TRUE.equals(author.getDeleted());
  }

  private boolean isDeleted(Banner banner) {
    return Boolean.TRUE.equals(banner.getDeleted());
  }

  private boolean isDeleted(News news) {
    return Boolean.TRUE.equals(news.getDeleted());
  }

  private boolean isDeleted(About about) {
    return Boolean.TRUE.equals(about.getDeleted());
  }

  private boolean isDeleted(AboutValue value) {
    return Boolean.TRUE.equals(value.getDeleted());
  }
}
