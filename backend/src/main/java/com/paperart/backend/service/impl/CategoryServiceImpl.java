package com.paperart.backend.service.impl;

import com.paperart.backend.dto.request.CategoryRequest;
import com.paperart.backend.dto.response.CategoryResponse;
import com.paperart.backend.entity.Category;
import com.paperart.backend.repository.CategoryRepository;
import com.paperart.backend.service.AuditService;
import com.paperart.backend.service.CategoryService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

  private final CategoryRepository categoryRepository;
  private final AuditService auditService;

  @Override
  public Page<CategoryResponse> getAll(int page, int size) {

    Pageable pageable =
        PageRequest.of(
            page, size, Sort.by("sortOrder").ascending().and(Sort.by("createdAt").descending()));

    return categoryRepository.findByDeletedFalse(pageable).map(this::toResponse);
  }

  @Override
  public List<CategoryResponse> getAll() {
    return categoryRepository.findByDeletedFalseAndPublishedTrueOrderBySortOrderAscCreatedAtDesc()
        .stream()
        .map(this::toResponse)
        .toList();
  }

  @Override
  public CategoryResponse getById(String id) {

    Category category = findActiveCategory(id);

    if (!Boolean.TRUE.equals(category.getPublished())) {
      throw new RuntimeException("Category not found");
    }

    return toResponse(category);
  }

  @Override
  public CategoryResponse getAdminById(String id) {

    Category category = findActiveCategory(id);

    return toResponse(category);
  }

  @Override
  public CategoryResponse create(CategoryRequest request) {

    Category category = new Category();

    category.setName(request.getName());
    category.setSortOrder(resolveCreateSortOrder(request.getSortOrder()));
    category.setPublished(request.getPublished() != null ? request.getPublished() : true);
    auditService.markCreated(category);

    return toResponse(categoryRepository.save(category));
  }

  @Override
  public CategoryResponse update(String id, CategoryRequest request) {

    Category category = findActiveCategory(id);

    category.setName(request.getName());
    category.setSortOrder(request.getSortOrder());
    category.setPublished(request.getPublished() != null ? request.getPublished() : true);
    auditService.markUpdated(category);

    return toResponse(categoryRepository.save(category));
  }

  @Override
  public void delete(String id) {
    Category category = findActiveCategory(id);
    auditService.markDeleted(category);
    categoryRepository.save(category);
  }

  private CategoryResponse toResponse(Category category) {

    return CategoryResponse.builder()
        .id(category.getId())
        .name(category.getName())
        .sortOrder(category.getSortOrder())
        .published(category.getPublished())
        .createdBy(auditService.toResponse(category.getCreatedBy()))
        .updatedBy(auditService.toResponse(category.getUpdatedBy()))
        .build();
  }

  private Category findActiveCategory(String id) {
    Category category =
        categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));

    if (Boolean.TRUE.equals(category.getDeleted())) {
      throw new RuntimeException("Category not found");
    }

    return category;
  }

  private Integer resolveCreateSortOrder(Integer sortOrder) {
    if (sortOrder != null && sortOrder > 0) {
      return sortOrder;
    }

    return categoryRepository.findMaxSortOrderByDeletedFalse() + 1;
  }
}
