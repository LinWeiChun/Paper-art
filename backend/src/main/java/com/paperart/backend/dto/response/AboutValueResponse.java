package com.paperart.backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AboutValueResponse {

  private String id;

  private String title;

  private String description;

  private Integer sortOrder;
}
