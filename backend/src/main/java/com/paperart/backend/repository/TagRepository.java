package com.paperart.backend.repository;

import com.paperart.backend.entity.Tag;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TagRepository extends JpaRepository<Tag, String> {

  Page<Tag> findByDeletedFalse(Pageable pageable);

  List<Tag> findByDeletedFalseAndPublishedTrueOrderByCreatedAtDesc();
}
