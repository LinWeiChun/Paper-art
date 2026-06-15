package com.paperart.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.paperart.backend.entity.Author;

@Repository
public interface AuthorRepository extends JpaRepository<Author, String> {

    List<Author> findAllByOrderBySortOrderAsc();
}
