package com.paperart.backend.repository;

import com.paperart.backend.entity.Author;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorRepository extends JpaRepository<Author, String> {

  List<Author> findAllByOrderBySortOrderAsc();
}
