package com.paperart.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.paperart.backend.entity.Art;

public interface ArtRepository extends JpaRepository<Art, String> {
	List<Art> findByFeaturedTrueOrderBySortOrderAsc();
}