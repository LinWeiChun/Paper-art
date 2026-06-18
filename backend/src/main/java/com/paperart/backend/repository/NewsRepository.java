package com.paperart.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.paperart.backend.entity.News;

public interface NewsRepository extends JpaRepository<News, String> {

	List<News> findTop5ByOrderByCreatedAtDesc();
}