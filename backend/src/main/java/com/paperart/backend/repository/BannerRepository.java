package com.paperart.backend.repository;

import com.paperart.backend.entity.Banner;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BannerRepository extends JpaRepository<Banner, String> {

  List<Banner> findByDeletedFalseOrderBySortOrderAsc();

  List<Banner> findByActiveTrueAndDeletedFalseOrderBySortOrderAsc();

  @Query(
      "select coalesce(max(banner.sortOrder), 0) from Banner banner where banner.deleted = false")
  Integer findMaxSortOrderByDeletedFalse();
}
