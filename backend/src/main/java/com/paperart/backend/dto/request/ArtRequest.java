package com.paperart.backend.dto.request;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArtRequest {

  private String title;

  private String description;

  private Integer year;

  private Integer sortOrder;

  private Boolean featured;

  private Boolean rentable;

  private Boolean published;

  private List<String> authorIds;

  private List<String> categoryIds;

  private List<String> tagIds;
}
