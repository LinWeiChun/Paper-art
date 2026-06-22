package com.paperart.backend.repository;

import com.paperart.backend.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BannerRepository extends JpaRepository<Banner, String> {

    List<Banner> findByActiveTrueOrderBySortOrderAsc();

}