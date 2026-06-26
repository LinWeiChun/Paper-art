package com.paperart.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "authors")
@Getter
@Setter
public class Author extends BaseEntity {

  private String name;

  private String title;

  @Column(columnDefinition = "LONGTEXT")
  private String description;

  private String avatarUrl;

  @Column(nullable = false)
  private Integer sortOrder = 0;
}
