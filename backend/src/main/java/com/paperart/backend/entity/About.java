package com.paperart.backend.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "about")
@Getter
@Setter
public class About extends BaseEntity {

    // Banner
    private String bannerTitle;

    private String bannerSubtitle;

    // 品牌故事
    private String storyTitle;

    @Lob
    private String storyContent;

    // 願景
    @Lob
    private String vision;

    @OneToMany(
        mappedBy = "about",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<AboutValue> values = new ArrayList<>();
}
