package com.paperart.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "arts")
@Getter
@Setter
public class Art extends BaseEntity {

  // 作品名稱
  private String title;

  // 作品編號
  private String artNumber;

  // 作品介紹
  @Column(columnDefinition = "LONGTEXT")
  private String description;

  // 縮圖
  private String thumbnail;

  // 創作年份
  private Integer year;

  // 尺寸：長(cm)
  private Double lengthCm;

  // 尺寸：寬(cm)
  private Double widthCm;

  // 尺寸：高(cm)
  private Double heightCm;

  // 材質
  private String material;

  // 色彩
  private String color;

  // 剪刻技法 / 製作手法
  private String technique;

  // 製作年代 / 時空背景
  private String creationPeriod;

  // 作品型態
  private String artworkType;

  // 備註
  @Column(columnDefinition = "TEXT")
  private String remarks;

  // 排序
  private Integer sortOrder = 0;

  // 是否首頁精選
  @Column(nullable = false)
  private Boolean featured = false;

  // 是否可租借
  @Column(nullable = false)
  private Boolean rentable = true;

  @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 1")
  private Boolean published = true;

  // 作者
  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
      name = "art_authors",
      joinColumns = @JoinColumn(name = "art_id"),
      inverseJoinColumns = @JoinColumn(name = "author_id"))
  private List<Author> authors = new ArrayList<>();

  // 分類
  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
      name = "art_categories",
      joinColumns = @JoinColumn(name = "art_id"),
      inverseJoinColumns = @JoinColumn(name = "category_id"))
  private List<Category> categories = new ArrayList<>();

  // 標籤
  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
      name = "art_tags",
      joinColumns = @JoinColumn(name = "art_id"),
      inverseJoinColumns = @JoinColumn(name = "tag_id"))
  private List<Tag> tags = new ArrayList<>();
}
