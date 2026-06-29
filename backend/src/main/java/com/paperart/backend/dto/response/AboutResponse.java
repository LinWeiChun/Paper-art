package com.paperart.backend.dto.response;

import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AboutResponse {

  private String id;

  private String bannerTitle;

  private String bannerSubtitle;

  private String storyTitle;

  private String storyContent;

  private String vision;

  private List<AboutValueResponse> values;

  private AuditUserResponse createdBy;

  private AuditUserResponse updatedBy;
}
