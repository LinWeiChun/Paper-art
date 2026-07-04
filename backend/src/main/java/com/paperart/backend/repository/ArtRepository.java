package com.paperart.backend.repository;

import com.paperart.backend.entity.Art;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface ArtRepository extends JpaRepository<Art, String>, JpaSpecificationExecutor<Art> {
  Page<Art> findByDeletedFalse(Pageable pageable);

  Page<Art> findByDeletedFalseAndPublishedTrue(Pageable pageable);

  List<Art> findByDeletedFalseAndPublishedTrueOrderBySortOrderAsc();

  List<Art> findByFeaturedTrueAndPublishedTrueAndDeletedFalseOrderBySortOrderAsc();

  List<Art> findTop5ByDeletedFalseAndPublishedTrueOrderByCreatedAtDesc();

  long countByDeletedFalse();

  @Query("select coalesce(max(art.sortOrder), 0) from Art art where art.deleted = false")
  Integer findMaxSortOrderByDeletedFalse();

  Optional<Art> findByArtNumberAndDeletedFalse(String artNumber);
}
