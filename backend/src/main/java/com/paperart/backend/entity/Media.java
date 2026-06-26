package com.paperart.backend.entity;

import com.paperart.backend.enums.MediaType;
import com.paperart.backend.enums.RelatedType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "media")
@Getter
@Setter
public class Media extends BaseEntity {

  @Column(nullable = false)
  private String mediaUrl;

  @Column(nullable = false)
  private String relatedId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private MediaType type;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private RelatedType relatedType;

  @Column(nullable = false)
  private Integer sortOrder = 0;
}
