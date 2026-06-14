package com.paperart.backend.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.paperart.backend.dto.request.NewsRequest;
import com.paperart.backend.dto.response.NewsResponse;
import com.paperart.backend.entity.News;
import com.paperart.backend.repository.NewsRepository;
import com.paperart.backend.service.FileUploadService;
import com.paperart.backend.service.NewsService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NewsServiceImpl implements NewsService {

    private final NewsRepository newsRepository;
    private final FileUploadService fileUploadService;

    @Override
    public Page<NewsResponse> getAllNews(int page, int size) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("publishDate").descending());

        return newsRepository.findAll(pageable)
                .map(this::toResponse);
    }

    @Override
    public NewsResponse getNewsById(String id) {

        News news = newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("News not found"));

        return toResponse(news);
    }

    @Override
    public NewsResponse createNews(
            NewsRequest request,
            MultipartFile image) {

        News news = new News();

        news.setTitle(request.getTitle());
        news.setContent(request.getContent());
        news.setSummary(request.getSummary());
        news.setFeatured(request.getFeatured());
        news.setPublishDate(request.getPublishDate());
        news.setStatus(request.getStatus());

        if (image != null && !image.isEmpty()) {

            String imageUrl = fileUploadService.upload(image, "news/");

            news.setCoverImage(imageUrl);
        }

        newsRepository.save(news);

        return toResponse(news);
    }

    @Override
    public NewsResponse updateNews(
            String id,
            NewsRequest request,
            MultipartFile image) {

        News news = newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("News not found"));

        news.setTitle(request.getTitle());
        news.setContent(request.getContent());
        news.setSummary(request.getSummary());
        news.setFeatured(request.getFeatured());
        news.setPublishDate(request.getPublishDate());
        news.setStatus(request.getStatus());

        // 有新圖片才更新
        if (image != null && !image.isEmpty()) {

            String imageUrl = fileUploadService.upload(image, "news/");

            news.setCoverImage(imageUrl);
        }

        newsRepository.save(news);

        return toResponse(news);
    }

    @Override
    public void deleteNews(String id) {

        newsRepository.deleteById(id);
    }

    private NewsResponse toResponse(News news) {

        return NewsResponse.builder()
                .id(news.getId())
                .title(news.getTitle())
                .content(news.getContent())
                .summary(news.getSummary())
                .coverImage(news.getCoverImage())
                .featured(news.getFeatured())
                .publishDate(news.getPublishDate())
                .status(news.getStatus())
                .build();
    }
}