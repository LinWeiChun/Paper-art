package com.paperart.backend.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
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