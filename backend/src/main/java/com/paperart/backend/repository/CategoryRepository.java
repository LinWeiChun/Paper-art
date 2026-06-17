package com.paperart.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.paperart.backend.entity.Category;

@Repository
public interface CategoryRepository
        extends JpaRepository<Category, String> {

}