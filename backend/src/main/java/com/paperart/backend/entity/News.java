package com.paperart.backend.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "news")
@Getter
@Setter
public class News extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "LONGTEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(nullable = false)
    private String coverImage;

    @Column(nullable = false)
    private Boolean featured = false;

    private LocalDate publishDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PublishStatus status = PublishStatus.DRAFT;

    @Column(nullable = false)
    private Integer sortOrder = 0;
}