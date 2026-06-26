package com.paperart.backend.dto.request;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class BannerRequest {

  private String title;

  private String subtitle;

  private MultipartFile image;

  private Integer sortOrder;

  private Boolean active;
}
