package com.paperart.backend.controller;

import com.paperart.backend.dto.response.DashboardResponse;
import com.paperart.backend.dto.response.OptionResponse;
import com.paperart.backend.repository.ArtRepository;
import com.paperart.backend.repository.AuthorRepository;
import com.paperart.backend.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

  private final ArtRepository artRepository;
  private final AuthorRepository authorRepository;
  private final NewsRepository newsRepository;

  @GetMapping
  public DashboardResponse getDashboard() {

    return DashboardResponse.builder()
        .artCount(artRepository.countByDeletedFalse())
        .authorCount(authorRepository.countByDeletedFalse())
        .newsCount(newsRepository.countByDeletedFalse())
        .recentArts(
            artRepository.findTop5ByDeletedFalseAndPublishedTrueOrderByCreatedAtDesc().stream()
                .map(art -> new OptionResponse(art.getId(), art.getTitle()))
                .toList())
        .recentNews(
            newsRepository.findTop5ByDeletedFalseOrderByCreatedAtDesc().stream()
                .map(news -> new OptionResponse(news.getId(), news.getTitle()))
                .toList())
        .build();
  }
}
