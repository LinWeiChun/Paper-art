package com.paperart.backend.controller;

import com.paperart.backend.dto.request.NewsRequest;
import com.paperart.backend.dto.response.NewsResponse;
import com.paperart.backend.service.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/news")
@RequiredArgsConstructor
public class NewsController {

  private final NewsService newsService;

  // 查全部
  @GetMapping
  public Page<NewsResponse> getAllNews(
      @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "6") int size) {

    return newsService.getAllNews(page, size);
  }

  @GetMapping("/admin")
  public Page<NewsResponse> getAllAdminNews(
      @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "6") int size) {

    return newsService.getAllAdminNews(page, size);
  }

  // 查單筆
  @GetMapping("/{id}")
  public NewsResponse getNewsById(@PathVariable String id) {

    return newsService.getNewsById(id);
  }

  @GetMapping("/admin/{id}")
  public NewsResponse getAdminNewsById(@PathVariable String id) {

    return newsService.getAdminNewsById(id);
  }

  // 新增
  @PostMapping
  public NewsResponse createNews(
      @RequestPart("news") NewsRequest request,
      @RequestPart(value = "image", required = false) MultipartFile image) {

    return newsService.createNews(request, image);
  }

  // 修改
  @PutMapping("/{id}")
  public NewsResponse updateNews(
      @PathVariable String id,
      @RequestPart("news") NewsRequest request,
      @RequestPart(value = "image", required = false) MultipartFile image) {

    return newsService.updateNews(id, request, image);
  }

  // 刪除
  @DeleteMapping("/{id}")
  public void deleteNews(@PathVariable String id) {

    newsService.deleteNews(id);
  }
}
