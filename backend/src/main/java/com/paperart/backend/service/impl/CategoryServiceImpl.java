package com.paperart.backend.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.paperart.backend.dto.request.CategoryRequest;
import com.paperart.backend.dto.response.CategoryResponse;
import com.paperart.backend.entity.Category;
import com.paperart.backend.repository.CategoryRepository;
import com.paperart.backend.service.CategoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public Page<CategoryResponse> getAll(int page, int size) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("sortOrder")
                        .ascending()
                        .and(Sort.by("createdAt").descending()));

        return categoryRepository
                .findAll(pageable)
                .map(this::toResponse);
    }

    @Override
    public CategoryResponse getById(String id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("分類不存在"));

        return toResponse(category);
    }

    @Override
    public CategoryResponse create(CategoryRequest request) {

        Category category = new Category();

        category.setName(request.getName());
        category.setSortOrder(request.getSortOrder());

        return toResponse(categoryRepository.save(category));
    }

    @Override
    public CategoryResponse update(
            String id,
            CategoryRequest request) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("分類不存在"));

        category.setName(request.getName());
        category.setSortOrder(request.getSortOrder());

        return toResponse(categoryRepository.save(category));
    }

    @Override
    public void delete(String id) {
        categoryRepository.deleteById(id);
    }

    private CategoryResponse toResponse(Category category) {

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .sortOrder(category.getSortOrder())
                .build();
    }
}