package com.paperart.backend.repository;

import com.paperart.backend.entity.Banner;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BannerRepository extends JpaRepository<Banner, String> {

  List<Banner> findByDeletedFalseOrderBySortOrderAsc();

  List<Banner> findByActiveTrueAndDeletedFalseOrderBySortOrderAsc();
}
