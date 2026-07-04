package com.paperart.backend.repository;

import com.paperart.backend.entity.Category;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
  Page<Category> findByDeletedFalse(Pageable pageable);

  List<Category> findByDeletedFalseAndPublishedTrueOrderBySortOrderAscCreatedAtDesc();

  @Query("select coalesce(max(category.sortOrder), 0) from Category category where category.deleted = false")
  Integer findMaxSortOrderByDeletedFalse();
}
