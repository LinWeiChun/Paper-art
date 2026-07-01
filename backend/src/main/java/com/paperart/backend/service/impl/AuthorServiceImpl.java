package com.paperart.backend.service.impl;

import com.paperart.backend.dto.request.AuthorRequest;
import com.paperart.backend.dto.response.AuthorResponse;
import com.paperart.backend.dto.response.UploadResponse;
import com.paperart.backend.entity.Author;
import com.paperart.backend.repository.AuthorRepository;
import com.paperart.backend.service.AuditService;
import com.paperart.backend.service.AuthorService;
import com.paperart.backend.service.FileUploadService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
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

  @Override
  public AuthorResponse getById(String id) {

    Author author = findActiveAuthor(id);

    return toResponse(author);
  }

  @Override
  public AuthorResponse create(AuthorRequest request, MultipartFile avatar) {

    Author author = new Author();

    author.setName(request.getName());
    author.setTitle(request.getTitle());
    author.setDescription(request.getDescription());
    author.setSortOrder(request.getSortOrder());
    author.setPublished(request.getPublished() != null ? request.getPublished() : true);
    auditService.markCreated(author);

    if (avatar != null && !avatar.isEmpty()) {

      UploadResponse uploadResponse = fileUploadService.upload(avatar, "authors/");

      author.setAvatarUrl(uploadResponse.getUrl());
    }

    return toResponse(authorRepository.save(author));
  }

  @Override
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
        authorRepository.findById(id).orElseThrow(() -> new RuntimeException("Author not found"));

    if (Boolean.TRUE.equals(author.getDeleted())) {
      throw new RuntimeException("Author not found");
    }

    return author;
  }
}
