package com.paperart.backend.service;

import com.paperart.backend.dto.request.CategoryRequest;
import com.paperart.backend.dto.response.CategoryResponse;
import java.util.List;
import org.springframework.data.domain.Page;

public interface CategoryService {

  Page<CategoryResponse> getAll(int page, int size);

  List<CategoryResponse> getAll();

  CategoryResponse getById(String id);

  CategoryResponse create(CategoryRequest request);

  CategoryResponse update(String id, CategoryRequest request);

  void delete(String id);
}
