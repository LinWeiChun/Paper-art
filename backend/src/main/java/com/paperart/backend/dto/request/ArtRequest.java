package com.paperart.backend.dto.request;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArtRequest {

  private String title;

  private String artNumber;

  private String description;

  private Integer year;

  private Double lengthCm;

  private Double widthCm;

  private Double heightCm;

  private String material;

  private String color;

  private String technique;

  private String creationPeriod;

  private String artworkType;

  private String remarks;

  private Integer sortOrder;

  private Boolean featured;

  private Boolean rentable;

  private Boolean published;

  private List<String> authorIds;

  private List<String> categoryIds;

  private List<String> tagIds;
}
