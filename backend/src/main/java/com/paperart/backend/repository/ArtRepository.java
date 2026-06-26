package com.paperart.backend.repository;

import com.paperart.backend.entity.Art;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ArtRepository extends JpaRepository<Art, String>, JpaSpecificationExecutor<Art> {
  List<Art> findByFeaturedTrueOrderBySortOrderAsc();

  List<Art> findTop5ByOrderByCreatedAtDesc();
}
