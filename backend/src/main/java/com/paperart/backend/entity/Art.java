package com.paperart.backend.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "arts")
@Getter
@Setter
public class Art extends BaseEntity {

    private String title;

    @Column(columnDefinition = "LONGTEXT")
    private String description;

    private String thumbnail;

    @Column(nullable = false)
    private Boolean featured = false;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "art_authors",
        joinColumns = @JoinColumn(name = "art_id"),
        inverseJoinColumns = @JoinColumn(name = "author_id")
    )
    private List<Author> authors = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "art_categories",
        joinColumns = @JoinColumn(name = "art_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<Category> categories = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "art_tags",
        joinColumns = @JoinColumn(name = "art_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags = new ArrayList<>();
}