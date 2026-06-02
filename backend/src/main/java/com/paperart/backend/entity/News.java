package com.paperart.backend.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "news")
@Getter
@Setter
@NoArgsConstructor
public class News extends BaseEntity {

    private String title;

    private String coverImage;

    private LocalDate publishDate;

    private Boolean featured = false;

    @Enumerated(EnumType.STRING)
    private PublishStatus status = PublishStatus.DRAFT;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "LONGTEXT")
    private String content;
}
