package com.paperart.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.paperart.backend.entity.About;

@Repository
public interface AboutRepository extends JpaRepository<About, String> {
}
