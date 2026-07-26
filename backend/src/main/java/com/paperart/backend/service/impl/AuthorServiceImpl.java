package com.paperart.backend.service.impl;

import com.paperart.backend.dto.request.AuthorRequest;
import com.paperart.backend.dto.response.AuthorResponse;
import com.paperart.backend.dto.response.ImportResponse;
import com.paperart.backend.dto.response.UploadResponse;
import com.paperart.backend.entity.Author;
import com.paperart.backend.exception.ApiException;
import com.paperart.backend.repository.AuthorRepository;
import com.paperart.backend.service.AuditService;
import com.paperart.backend.service.AuthorService;
import com.paperart.backend.service.FileUploadService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthorServiceImpl implements AuthorService {

  private final AuthorRepository authorRepository;
  private final FileUploadService fileUploadService;
  private final AuditService auditService;

  // 前台：全部作者
  @Override
  public List<AuthorResponse> getAll() {

    return authorRepository.findByDeletedFalseAndPublishedTrueOrderBySortOrderAsc().stream()
        .map(this::toResponse)
        .toList();
  }

  // 分頁查詢
  @Override
  public Page<AuthorResponse> getAll(int page, int size) {

    Pageable pageable = PageRequest.of(page, size, Sort.by("sortOrder").ascending());

    return authorRepository.findByDeletedFalse(pageable).map(this::toResponse);
  }

  // 前台：分頁作者
  @Override
  public Page<AuthorResponse> getPublished(int page, int size) {

    Pageable pageable = PageRequest.of(page, size, Sort.by("sortOrder").ascending());

    return authorRepository.findByDeletedFalseAndPublishedTrue(pageable).map(this::toResponse);
  }

  @Override
  public AuthorResponse getById(String id) {

    Author author = findActiveAuthor(id);

    if (!Boolean.TRUE.equals(author.getPublished())) {
      throw new ApiException(HttpStatus.NOT_FOUND, "AUTHOR_NOT_FOUND", "找不到作者");
    }

    return toResponse(author);
  }

  @Override
  public AuthorResponse getAdminById(String id) {

    Author author = findActiveAuthor(id);

    return toResponse(author);
  }

  @Override
  @Transactional
  public AuthorResponse create(AuthorRequest request, MultipartFile avatar) {

    Author author = new Author();

    author.setName(request.getName());
    author.setTitle(request.getTitle());
    author.setDescription(request.getDescription());
    author.setSortOrder(resolveCreateSortOrder(request.getSortOrder()));
    author.setPublished(request.getPublished() != null ? request.getPublished() : true);
    auditService.markCreated(author);

    if (avatar != null && !avatar.isEmpty()) {

      UploadResponse uploadResponse = fileUploadService.upload(avatar, "authors/");

      author.setAvatarUrl(uploadResponse.getUrl());
    }

    return toResponse(authorRepository.save(author));
  }

  @Override
  @Transactional
  public ImportResponse importAuthors(MultipartFile file) {
    int createdCount = 0;
    int skippedCount = 0;
    int failedCount = 0;
    DataFormatter formatter = new DataFormatter();

    try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
      for (Sheet sheet : workbook) {
        Row header = sheet.getRow(0);
        if (header == null) {
          continue;
        }

        for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
          Row row = sheet.getRow(rowIndex);
          if (row == null) {
            continue;
          }

          try {
            String name = getCellValue(row, 0, formatter);
            if (name.isBlank()) {
              skippedCount++;
              continue;
            }

            if (authorRepository.findByNameAndDeletedFalse(name).isPresent()) {
              skippedCount++;
              continue;
            }

            Author author = new Author();
            author.setName(name);
            author.setSortOrder(
                resolveCreateSortOrder(parseInteger(getCellValue(row, 1, formatter))));
            author.setPublished(parsePublished(getCellValue(row, 2, formatter)));
            auditService.markCreated(author);
            authorRepository.save(author);
            createdCount++;
          } catch (Exception e) {
            failedCount++;
          }
        }
      }
    } catch (Exception e) {
      throw new RuntimeException("Import authors failed", e);
    }

    return ImportResponse.builder()
        .createdCount(createdCount)
        .skippedCount(skippedCount)
        .failedCount(failedCount)
        .build();
  }

  @Override
  @Transactional
  public AuthorResponse update(String id, AuthorRequest request, MultipartFile avatar) {

    Author author = findActiveAuthor(id);

    author.setName(request.getName());
    author.setTitle(request.getTitle());
    author.setDescription(request.getDescription());
    author.setSortOrder(request.getSortOrder());
    author.setPublished(request.getPublished() != null ? request.getPublished() : true);
    auditService.markUpdated(author);

    if (avatar != null && !avatar.isEmpty()) {
      String oldAvatarUrl = author.getAvatarUrl();

      UploadResponse uploadResponse = fileUploadService.upload(avatar, "authors/");

      author.setAvatarUrl(uploadResponse.getUrl());
      fileUploadService.moveToDeleteFolder(oldAvatarUrl);
    }

    return toResponse(authorRepository.save(author));
  }

  @Override
  @Transactional
  public void delete(String id) {

    Author author = findActiveAuthor(id);
    fileUploadService.moveToDeleteFolder(author.getAvatarUrl());
    auditService.markDeleted(author);
    authorRepository.save(author);
  }

  private AuthorResponse toResponse(Author author) {

    return AuthorResponse.builder()
        .id(author.getId())
        .name(author.getName())
        .title(author.getTitle())
        .description(author.getDescription())
        .avatarUrl(author.getAvatarUrl())
        .sortOrder(author.getSortOrder())
        .published(author.getPublished())
        .createdBy(auditService.toResponse(author.getCreatedBy()))
        .updatedBy(auditService.toResponse(author.getUpdatedBy()))
        .build();
  }

  private Author findActiveAuthor(String id) {
    Author author =
        authorRepository
            .findById(id)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "AUTHOR_NOT_FOUND", "找不到作者"));

    if (Boolean.TRUE.equals(author.getDeleted())) {
      throw new ApiException(HttpStatus.NOT_FOUND, "AUTHOR_NOT_FOUND", "找不到作者");
    }

    return author;
  }

  private Integer resolveCreateSortOrder(Integer sortOrder) {
    if (sortOrder != null && sortOrder > 0) {
      return sortOrder;
    }

    return authorRepository.findMaxSortOrderByDeletedFalse() + 1;
  }

  private String getCellValue(Row row, int cellIndex, DataFormatter formatter) {
    return formatter.formatCellValue(row.getCell(cellIndex)).trim();
  }

  private Integer parseInteger(String value) {
    if (value == null || value.isBlank()) {
      return null;
    }

    try {
      return (int) Double.parseDouble(value.trim());
    } catch (NumberFormatException e) {
      return null;
    }
  }

  private Boolean parsePublished(String value) {
    if (value == null || value.isBlank()) {
      return true;
    }

    String normalized = value.trim().toLowerCase();
    return normalized.equals("1")
        || normalized.equals("true")
        || normalized.equals("yes")
        || normalized.equals("y")
        || normalized.equals("是")
        || normalized.equals("發布")
        || normalized.equals("發佈")
        || normalized.equals("已發布")
        || normalized.equals("已發佈");
  }
}
