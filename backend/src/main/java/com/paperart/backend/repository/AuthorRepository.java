package com.paperart.backend.repository;

import com.paperart.backend.entity.Author;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorRepository extends JpaRepository<Author, String> {

  Page<Author> findByDeletedFalse(Pageable pageable);

  Page<Author> findByDeletedFalseAndPublishedTrue(Pageable pageable);

  List<Author> findByDeletedFalseAndPublishedTrueOrderBySortOrderAsc();

  long countByDeletedFalse();

  @Query("select coalesce(max(author.sortOrder), 0) from Author author where author.deleted = false")
  Integer findMaxSortOrderByDeletedFalse();

  Optional<Author> findByNameAndDeletedFalse(String name);
}
