package com.paperart.backend.service;

import com.paperart.backend.dto.request.CategoryRequest;
import com.paperart.backend.dto.response.CategoryResponse;
import com.paperart.backend.dto.response.ImportResponse;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface CategoryService {

  Page<CategoryResponse> getAll(int page, int size);

  List<CategoryResponse> getAll();

  CategoryResponse getById(String id);

  CategoryResponse getAdminById(String id);

  CategoryResponse create(CategoryRequest request);

  ImportResponse importCategories(MultipartFile file);

  CategoryResponse update(String id, CategoryRequest request);

  void delete(String id);
}
