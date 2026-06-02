package com.paperart.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "authors")
@Getter
@Setter
@NoArgsConstructor
public class Author extends BaseEntity {

    private String name;

    private String title;

    private String avatar;

    private Integer sortOrder = 0;

    @Column(columnDefinition = "TEXT")
    private String description;
}
