package com.paperart.backend.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.paperart.backend.dto.request.NewsRequest;
import com.paperart.backend.dto.response.NewsResponse;

public interface NewsService {
	Page<NewsResponse> getAllNews(int page, int size);

    NewsResponse getNewsById(String id);

    NewsResponse createNews(NewsRequest request, MultipartFile image);

    NewsResponse updateNews(String id, NewsRequest request, MultipartFile image);

    void deleteNews(String id);
}