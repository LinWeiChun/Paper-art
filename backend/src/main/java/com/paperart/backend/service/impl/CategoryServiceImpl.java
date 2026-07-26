package com.paperart.backend.service.impl;

import com.paperart.backend.dto.request.CategoryRequest;
import com.paperart.backend.dto.response.CategoryResponse;
import com.paperart.backend.dto.response.ImportResponse;
import com.paperart.backend.entity.Category;
import com.paperart.backend.exception.ApiException;
import com.paperart.backend.repository.CategoryRepository;
import com.paperart.backend.service.AuditService;
import com.paperart.backend.service.CategoryService;
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
    return categoryRepository
        .findByDeletedFalseAndPublishedTrueOrderBySortOrderAscCreatedAtDesc()
        .stream()
        .map(this::toResponse)
        .toList();
  }

  @Override
  public CategoryResponse getById(String id) {

    Category category = findActiveCategory(id);

    if (!Boolean.TRUE.equals(category.getPublished())) {
      throw new ApiException(HttpStatus.NOT_FOUND, "CATEGORY_NOT_FOUND", "找不到分類");
    }

    return toResponse(category);
  }

  @Override
  public CategoryResponse getAdminById(String id) {

    Category category = findActiveCategory(id);

    return toResponse(category);
  }

  @Override
  @Transactional
  public CategoryResponse create(CategoryRequest request) {

    Category category = new Category();

    category.setName(request.getName());
    category.setSortOrder(resolveCreateSortOrder(request.getSortOrder()));
    category.setPublished(request.getPublished() != null ? request.getPublished() : true);
    auditService.markCreated(category);

    return toResponse(categoryRepository.save(category));
  }

  @Override
  @Transactional
  public ImportResponse importCategories(MultipartFile file) {
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

            if (categoryRepository.findByNameAndDeletedFalse(name).isPresent()) {
              skippedCount++;
              continue;
            }

            Category category = new Category();
            category.setName(name);
            category.setSortOrder(
                resolveCreateSortOrder(parseInteger(getCellValue(row, 1, formatter))));
            category.setPublished(parsePublished(getCellValue(row, 2, formatter)));
            auditService.markCreated(category);
            categoryRepository.save(category);
            createdCount++;
          } catch (Exception e) {
            failedCount++;
          }
        }
      }
    } catch (Exception e) {
      throw new RuntimeException("Import categories failed", e);
    }

    return ImportResponse.builder()
        .createdCount(createdCount)
        .skippedCount(skippedCount)
        .failedCount(failedCount)
        .build();
  }

  @Override
  @Transactional
  public CategoryResponse update(String id, CategoryRequest request) {

    Category category = findActiveCategory(id);

    category.setName(request.getName());
    category.setSortOrder(request.getSortOrder());
    category.setPublished(request.getPublished() != null ? request.getPublished() : true);
    auditService.markUpdated(category);

    return toResponse(categoryRepository.save(category));
  }

  @Override
  @Transactional
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
        categoryRepository
            .findById(id)
            .orElseThrow(
                () -> new ApiException(HttpStatus.NOT_FOUND, "CATEGORY_NOT_FOUND", "找不到分類"));

    if (Boolean.TRUE.equals(category.getDeleted())) {
      throw new ApiException(HttpStatus.NOT_FOUND, "CATEGORY_NOT_FOUND", "找不到分類");
    }

    return category;
  }

  private Integer resolveCreateSortOrder(Integer sortOrder) {
    if (sortOrder != null && sortOrder > 0) {
      return sortOrder;
    }

    return categoryRepository.findMaxSortOrderByDeletedFalse() + 1;
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
