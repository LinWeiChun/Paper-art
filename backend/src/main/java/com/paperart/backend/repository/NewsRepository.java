package com.paperart.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.paperart.backend.entity.News;

public interface NewsRepository extends JpaRepository<News, String> {

}