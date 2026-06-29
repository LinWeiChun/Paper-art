package com.paperart.backend.repository;

import com.paperart.backend.entity.News;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsRepository extends JpaRepository<News, String> {

  Page<News> findByDeletedFalse(Pageable pageable);

  List<News> findTop5ByDeletedFalseOrderByCreatedAtDesc();

  long countByDeletedFalse();
}
