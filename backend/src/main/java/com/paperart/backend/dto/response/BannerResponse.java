package com.paperart.backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class BannerResponse {

  private String id;

  private String title;

  private String subtitle;

  private String image;

  private Integer sortOrder;

  private Boolean active;

  private AuditUserResponse createdBy;

  private AuditUserResponse updatedBy;
}
