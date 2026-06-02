package com.paperart.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "media")
@Getter
@Setter
@NoArgsConstructor
public class Media extends BaseEntity {

    private String url;

    @Enumerated(EnumType.STRING)
    private MediaType type;

    @Enumerated(EnumType.STRING)
    private RelatedType relatedType;

    private String relatedId;
}