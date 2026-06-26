package com.paperart.backend.repository;

import com.paperart.backend.entity.Category;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
  List<Category> findAllByOrderBySortOrderAscCreatedAtDesc();
}
