package com.paperart.backend.dto.response;

import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class ArtResponse {

  private String id;

  private String title;

  private String artNumber;

  private String description;

  private String thumbnail;

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

  private List<OptionResponse> authors;
  private List<OptionResponse> categories;
  private List<OptionResponse> tags;

  private AuditUserResponse createdBy;

  private AuditUserResponse updatedBy;
}
