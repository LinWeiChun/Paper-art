package com.paperart.backend.dto.request;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AboutRequest {

  private String bannerTitle;

  private String bannerSubtitle;

  private String storyTitle;

  private String storyContent;

  private String vision;

  private List<AboutValueRequest> values;
}
