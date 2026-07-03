package com.paperart.backend.service.impl;

import com.paperart.backend.dto.request.ArtRequest;
import com.paperart.backend.dto.request.ArtSearchRequest;
import com.paperart.backend.dto.response.ArtResponse;
import com.paperart.backend.dto.response.OptionResponse;
import com.paperart.backend.dto.response.UploadResponse;
import com.paperart.backend.entity.Art;
import com.paperart.backend.entity.Author;
import com.paperart.backend.entity.Category;
import com.paperart.backend.entity.Tag;
import com.paperart.backend.repository.ArtRepository;
import com.paperart.backend.repository.AuthorRepository;
import com.paperart.backend.repository.CategoryRepository;
import com.paperart.backend.repository.TagRepository;
import com.paperart.backend.service.AuditService;
import com.paperart.backend.service.ArtService;
import com.paperart.backend.service.FileUploadService;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ArtServiceImpl implements ArtService {

  private final ArtRepository artRepository;
  private final AuthorRepository authorRepository;
  private final CategoryRepository categoryRepository;
  private final TagRepository tagRepository;
  private final FileUploadService fileUploadService;
  private final AuditService auditService;

  /** 前台全部作品 */
  @Override
  public List<ArtResponse> getAll() {

    return artRepository.findByDeletedFalseAndPublishedTrueOrderBySortOrderAsc().stream()
        .map(this::toPublicResponse)
        .toList();
  }

  /** 後台分頁 */
  @Override
  public Page<ArtResponse> getAll(int page, int size) {

    Pageable pageable = PageRequest.of(page, size, Sort.by("sortOrder").ascending());

    return artRepository.findByDeletedFalseAndPublishedTrue(pageable).map(this::toPublicResponse);
  }

  @Override
  public Page<ArtResponse> getAdminAll(int page, int size) {

    Pageable pageable = PageRequest.of(page, size, Sort.by("sortOrder").ascending());

    return artRepository.findByDeletedFalse(pageable).map(this::toResponse);
  }

  /** 單筆查詢 */
  @Override
  public ArtResponse getById(String id) {

    Art art = findActiveArt(id);

    if (!Boolean.TRUE.equals(art.getPublished())) {
      throw new RuntimeException("Art not found");
    }

    return toPublicResponse(art);
  }

  @Override
  public ArtResponse getAdminById(String id) {

    Art art = findActiveArt(id);

    return toResponse(art);
  }

  /** 新增作品 */
  @Override
  public ArtResponse create(ArtRequest request, MultipartFile thumbnail) {

    Art art = new Art();

    art.setTitle(request.getTitle());
    art.setArtNumber(request.getArtNumber());
    art.setDescription(request.getDescription());
    art.setYear(request.getYear());
    art.setLengthCm(request.getLengthCm());
    art.setWidthCm(request.getWidthCm());
    art.setHeightCm(request.getHeightCm());
    art.setMaterial(request.getMaterial());
    art.setColor(request.getColor());
    art.setTechnique(request.getTechnique());
    art.setCreationPeriod(request.getCreationPeriod());
    art.setArtworkType(request.getArtworkType());
    art.setRemarks(request.getRemarks());
    art.setSortOrder(request.getSortOrder());
    art.setFeatured(request.getFeatured());
    art.setRentable(request.getRentable());
    art.setPublished(request.getPublished() != null ? request.getPublished() : true);

    art.setAuthors(
        request.getAuthorIds() == null
            ? new ArrayList<>()
            : authorRepository.findAllById(request.getAuthorIds()));

    art.setCategories(
        request.getCategoryIds() == null
            ? new ArrayList<>()
            : categoryRepository.findAllById(request.getCategoryIds()));

    art.setTags(
        request.getTagIds() == null
            ? new ArrayList<>()
            : tagRepository.findAllById(request.getTagIds()));
    auditService.markCreated(art);

    // 上傳縮圖
    if (thumbnail != null && !thumbnail.isEmpty()) {

      UploadResponse uploadResponse = fileUploadService.upload(thumbnail, "arts/");

      art.setThumbnail(uploadResponse.getUrl());
    }

    artRepository.save(art);

    return toResponse(art);
  }

  /** 修改作品 */
  @Override
  public ArtResponse update(String id, ArtRequest request, MultipartFile thumbnail) {

    Art art = findActiveArt(id);

    art.setTitle(request.getTitle());
    art.setArtNumber(request.getArtNumber());
    art.setDescription(request.getDescription());
    art.setYear(request.getYear());
    art.setLengthCm(request.getLengthCm());
    art.setWidthCm(request.getWidthCm());
    art.setHeightCm(request.getHeightCm());
    art.setMaterial(request.getMaterial());
    art.setColor(request.getColor());
    art.setTechnique(request.getTechnique());
    art.setCreationPeriod(request.getCreationPeriod());
    art.setArtworkType(request.getArtworkType());
    art.setRemarks(request.getRemarks());
    art.setSortOrder(request.getSortOrder());
    art.setFeatured(request.getFeatured());
    art.setRentable(request.getRentable());
    art.setPublished(request.getPublished() != null ? request.getPublished() : true);

    art.setAuthors(
        request.getAuthorIds() == null
            ? new ArrayList<>()
            : authorRepository.findAllById(request.getAuthorIds()));

    art.setCategories(
        request.getCategoryIds() == null
            ? new ArrayList<>()
            : categoryRepository.findAllById(request.getCategoryIds()));

    art.setTags(
        request.getTagIds() == null
            ? new ArrayList<>()
            : tagRepository.findAllById(request.getTagIds()));
    auditService.markUpdated(art);

    // 更新圖片
    if (thumbnail != null && !thumbnail.isEmpty()) {
      String oldThumbnail = art.getThumbnail();

      UploadResponse uploadResponse = fileUploadService.upload(thumbnail, "arts/");

      art.setThumbnail(uploadResponse.getUrl());
      fileUploadService.moveToDeleteFolder(oldThumbnail);
    }

    artRepository.save(art);

    return toResponse(art);
  }

  @Override
  public Page<ArtResponse> search(ArtSearchRequest request, int page, int size) {

    Pageable pageable = PageRequest.of(page, size, buildSort(request.getSort()));

    Specification<Art> spec =
        (root, query, cb) -> {
          List<Predicate> predicates = new ArrayList<>();

          predicates.add(cb.isFalse(root.get("deleted")));
          predicates.add(cb.isTrue(root.get("published")));

          // 關鍵字
          if (request.getKeyword() != null && !request.getKeyword().isBlank()) {

            String keyword = "%" + request.getKeyword().trim().toLowerCase() + "%";

            predicates.add(
                cb.or(
                    cb.like(cb.lower(root.get("title")), keyword),
                    cb.like(cb.lower(root.get("description")), keyword),
                    cb.like(cb.lower(root.get("artNumber")), keyword),
                    cb.like(cb.lower(root.get("material")), keyword),
                    cb.like(cb.lower(root.get("color")), keyword),
                    cb.like(cb.lower(root.get("technique")), keyword),
                    cb.like(cb.lower(root.get("creationPeriod")), keyword),
                    cb.like(cb.lower(root.get("artworkType")), keyword),
                    cb.like(cb.lower(root.get("remarks")), keyword)));
          }

          // 是否可租借
          if (request.getRentable() != null) {
            predicates.add(cb.equal(root.get("rentable"), request.getRentable()));
          }

          // 是否精選
          if (request.getFeatured() != null) {
            predicates.add(cb.equal(root.get("featured"), request.getFeatured()));
          }

          // 作者
          if (request.getAuthorIds() != null && !request.getAuthorIds().isEmpty()) {

            Join<Art, Author> join = root.join("authors");

            predicates.add(join.get("id").in(request.getAuthorIds()));

            query.distinct(true);
          }

          // 分類
          if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {

            Join<Art, Category> join = root.join("categories");

            predicates.add(join.get("id").in(request.getCategoryIds()));

            query.distinct(true);
          }

          // 標籤
          if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {

            Join<Art, Tag> join = root.join("tags");

            predicates.add(join.get("id").in(request.getTagIds()));

            query.distinct(true);
          }

          return cb.and(predicates.toArray(new Predicate[0]));
        };

    return artRepository.findAll(spec, pageable).map(this::toPublicResponse);
  }

  /** 刪除 */
  @Override
  public void delete(String id) {

    Art art = findActiveArt(id);
    fileUploadService.moveToDeleteFolder(art.getThumbnail());
    auditService.markDeleted(art);
    artRepository.save(art);
  }

  @Override
  public List<ArtResponse> getFeaturedArts() {
    return artRepository.findByFeaturedTrueAndPublishedTrueAndDeletedFalseOrderBySortOrderAsc().stream()
        .map(this::toPublicResponse)
        .toList();
  }

  /** Entity → Response */
  private ArtResponse toResponse(Art art) {

    return ArtResponse.builder()
        .id(art.getId())
        .title(art.getTitle())
        .artNumber(art.getArtNumber())
        .description(art.getDescription())
        .thumbnail(art.getThumbnail())
        .year(art.getYear())
        .lengthCm(art.getLengthCm())
        .widthCm(art.getWidthCm())
        .heightCm(art.getHeightCm())
        .material(art.getMaterial())
        .color(art.getColor())
        .technique(art.getTechnique())
        .creationPeriod(art.getCreationPeriod())
        .artworkType(art.getArtworkType())
        .remarks(art.getRemarks())
        .sortOrder(art.getSortOrder())
        .featured(art.getFeatured())
        .rentable(art.getRentable())
        .published(art.getPublished())
        .authors(
            art.getAuthors().stream()
                .map(author -> new OptionResponse(author.getId(), author.getName()))
                .toList())
        .categories(
            art.getCategories().stream()
                .map(category -> new OptionResponse(category.getId(), category.getName()))
                .toList())
        .tags(
            art.getTags().stream()
                .map(tag -> new OptionResponse(tag.getId(), tag.getName()))
                .toList())
        .createdBy(auditService.toResponse(art.getCreatedBy()))
        .updatedBy(auditService.toResponse(art.getUpdatedBy()))
        .build();
  }

  private ArtResponse toPublicResponse(Art art) {

    return ArtResponse.builder()
        .id(art.getId())
        .title(art.getTitle())
        .artNumber(art.getArtNumber())
        .description(art.getDescription())
        .thumbnail(art.getThumbnail())
        .year(art.getYear())
        .lengthCm(art.getLengthCm())
        .widthCm(art.getWidthCm())
        .heightCm(art.getHeightCm())
        .material(art.getMaterial())
        .color(art.getColor())
        .technique(art.getTechnique())
        .creationPeriod(art.getCreationPeriod())
        .artworkType(art.getArtworkType())
        .remarks(art.getRemarks())
        .sortOrder(art.getSortOrder())
        .featured(art.getFeatured())
        .rentable(art.getRentable())
        .published(art.getPublished())
        .authors(
            art.getAuthors().stream()
                .filter(author -> Boolean.TRUE.equals(author.getPublished()))
                .map(author -> new OptionResponse(author.getId(), author.getName()))
                .toList())
        .categories(
            art.getCategories().stream()
                .filter(category -> Boolean.TRUE.equals(category.getPublished()))
                .map(category -> new OptionResponse(category.getId(), category.getName()))
                .toList())
        .tags(
            art.getTags().stream()
                .filter(tag -> Boolean.TRUE.equals(tag.getPublished()))
                .map(tag -> new OptionResponse(tag.getId(), tag.getName()))
                .toList())
        .build();
  }

  private Sort buildSort(String sort) {

    if (sort == null || sort.isBlank()) {
      return Sort.by("sortOrder").ascending();
    }

    return switch (sort) {
      case "newest" -> Sort.by("createdAt").descending();

      case "oldest" -> Sort.by("createdAt").ascending();

      case "yearDesc" -> Sort.by("year").descending();

      case "yearAsc" -> Sort.by("year").ascending();

      case "titleAsc" -> Sort.by("title").ascending();

      case "titleDesc" -> Sort.by("title").descending();

      default -> Sort.by("sortOrder").ascending();
    };
  }

  private Art findActiveArt(String id) {
    Art art = artRepository.findById(id).orElseThrow(() -> new RuntimeException("Art not found"));

    if (Boolean.TRUE.equals(art.getDeleted())) {
      throw new RuntimeException("Art not found");
    }

    return art;
  }
}
