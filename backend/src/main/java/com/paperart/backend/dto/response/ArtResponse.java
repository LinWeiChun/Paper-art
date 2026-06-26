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

  private String description;

  private String thumbnail;

  private Integer year;

  private Integer sortOrder;

  private Boolean featured;

  private Boolean rentable;

  private List<OptionResponse> authors;
  private List<OptionResponse> categories;
  private List<OptionResponse> tags;
}
