package com.paperart.backend.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.paperart.backend.dto.request.CategoryRequest;
import com.paperart.backend.dto.response.CategoryResponse;

public interface CategoryService {

    Page<CategoryResponse> getAll(int page, int size);

    List<CategoryResponse> getAll();
    
    CategoryResponse getById(String id);

    CategoryResponse create(CategoryRequest request);

    CategoryResponse update(String id, CategoryRequest request);

    void delete(String id);
}