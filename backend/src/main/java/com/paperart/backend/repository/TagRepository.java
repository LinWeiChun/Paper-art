package com.paperart.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.paperart.backend.entity.Tag;


@Repository
public interface TagRepository
        extends JpaRepository<Tag, String> {

}