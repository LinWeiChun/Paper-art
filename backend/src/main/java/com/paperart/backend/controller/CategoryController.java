package com.paperart.backend.controller;

import com.paperart.backend.dto.request.CategoryRequest;
import com.paperart.backend.dto.response.CategoryResponse;
import com.paperart.backend.service.CategoryService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

  private final CategoryService categoryService;

  @GetMapping
  public List<CategoryResponse> getAll() {
    return categoryService.getAll();
  }

  @GetMapping("/admin")
  public ResponseEntity<Page<CategoryResponse>> getAll(
      @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {

    return ResponseEntity.ok(categoryService.getAll(page, size));
  }

  @GetMapping("/{id}")
  public ResponseEntity<CategoryResponse> getById(@PathVariable String id) {

    return ResponseEntity.ok(categoryService.getById(id));
  }

  @PostMapping
  public ResponseEntity<CategoryResponse> create(@RequestBody CategoryRequest request) {

    return ResponseEntity.ok(categoryService.create(request));
  }

  @PutMapping("/{id}")
  public ResponseEntity<CategoryResponse> update(
      @PathVariable String id, @RequestBody CategoryRequest request) {

    return ResponseEntity.ok(categoryService.update(id, request));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable String id) {

    categoryService.delete(id);

    return ResponseEntity.noContent().build();
  }
}
