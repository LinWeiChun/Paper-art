package com.paperart.backend.dto.request;

import com.paperart.backend.enums.PublishStatus;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NewsRequest {

  private String title;

  private String content;

  private String summary;

  private String coverImage;

  private Boolean featured;

  private LocalDate publishDate;

  private PublishStatus status;
}
