package com.paperart.backend.entity;

import com.paperart.backend.enums.MediaType;
import com.paperart.backend.enums.RelatedType;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
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