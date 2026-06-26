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

  /** 前台全部作品 */
  @Override
  public List<ArtResponse> getAll() {

    return artRepository.findAll(Sort.by("sortOrder").ascending()).stream()
        .map(this::toResponse)
        .toList();
  }

  /** 後台分頁 */
  @Override
  public Page<ArtResponse> getAll(int page, int size) {

    Pageable pageable = PageRequest.of(page, size, Sort.by("sortOrder").ascending());

    return artRepository.findAll(pageable).map(this::toResponse);
  }

  /** 單筆查詢 */
  @Override
  public ArtResponse getById(String id) {

    Art art = artRepository.findById(id).orElseThrow(() -> new RuntimeException("Art not found"));

    return toResponse(art);
  }

  /** 新增作品 */
  @Override
  public ArtResponse create(ArtRequest request, MultipartFile thumbnail) {

    Art art = new Art();

    art.setTitle(request.getTitle());
    art.setDescription(request.getDescription());
    art.setYear(request.getYear());
    art.setSortOrder(request.getSortOrder());
    art.setFeatured(request.getFeatured());
    art.setRentable(request.getRentable());

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

    Art art = artRepository.findById(id).orElseThrow(() -> new RuntimeException("Art not found"));

    art.setTitle(request.getTitle());
    art.setDescription(request.getDescription());
    art.setYear(request.getYear());
    art.setSortOrder(request.getSortOrder());
    art.setFeatured(request.getFeatured());
    art.setRentable(request.getRentable());

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

    // 更新圖片
    if (thumbnail != null && !thumbnail.isEmpty()) {

      UploadResponse uploadResponse = fileUploadService.upload(thumbnail, "arts/");

      art.setThumbnail(uploadResponse.getUrl());
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

          // 關鍵字
          if (request.getKeyword() != null && !request.getKeyword().isBlank()) {

            String keyword = "%" + request.getKeyword().trim().toLowerCase() + "%";

            predicates.add(
                cb.or(
                    cb.like(cb.lower(root.get("title")), keyword),
                    cb.like(cb.lower(root.get("description")), keyword)));
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

    return artRepository.findAll(spec, pageable).map(this::toResponse);
  }

  /** 刪除 */
  @Override
  public void delete(String id) {

    artRepository.deleteById(id);
  }

  @Override
  public List<ArtResponse> getFeaturedArts() {
    return artRepository.findByFeaturedTrueOrderBySortOrderAsc().stream()
        .map(this::toResponse)
        .toList();
  }

  /** Entity → Response */
  private ArtResponse toResponse(Art art) {

    return ArtResponse.builder()
        .id(art.getId())
        .title(art.getTitle())
        .description(art.getDescription())
        .thumbnail(art.getThumbnail())
        .year(art.getYear())
        .sortOrder(art.getSortOrder())
        .featured(art.getFeatured())
        .rentable(art.getRentable())
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
}
