package com.paperart.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "banners")
public class Banner extends BaseEntity {

  @Column(nullable = false)
  private String title;

  private String subtitle;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String image;

  private Integer sortOrder = 0;

  private Boolean active = true;
}
