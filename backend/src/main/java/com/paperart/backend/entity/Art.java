package com.paperart.backend.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "arts")
@Getter
@Setter
@NoArgsConstructor
public class Art extends BaseEntity {

    private String title;

    private String thumbnail;

    private Boolean featured = false;

    @Column(columnDefinition = "LONGTEXT")
    private String description;

    @ManyToMany
    @JoinTable(
        name = "art_authors",
        joinColumns = @JoinColumn(name = "art_id"),
        inverseJoinColumns = @JoinColumn(name = "author_id")
    )
    private List<Author> authors = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "art_categories",
        joinColumns = @JoinColumn(name = "art_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<Category> categories = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "art_tags",
        joinColumns = @JoinColumn(name = "art_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags = new ArrayList<>();
}