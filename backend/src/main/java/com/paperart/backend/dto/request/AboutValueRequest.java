package com.paperart.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AboutValueRequest {

  private String title;

  private String description;

  private Integer sortOrder;
}
