package com.paperart.backend.repository;

import com.paperart.backend.entity.News;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsRepository extends JpaRepository<News, String> {

  List<News> findTop5ByOrderByCreatedAtDesc();
}
