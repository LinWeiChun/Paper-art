package com.paperart.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "categories")
@Getter
@Setter
public class Category extends BaseEntity {

  @Column(nullable = false, unique = true)
  private String name;

  @Column(nullable = false)
  private Integer sortOrder = 0;
}
