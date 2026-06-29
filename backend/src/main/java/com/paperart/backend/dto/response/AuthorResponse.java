package com.paperart.backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuthorResponse {

  private String id;

  private String name;

  private String title;

  private String description;

  private String avatarUrl;

  private Integer sortOrder;

  private Boolean published;

  private AuditUserResponse createdBy;

  private AuditUserResponse updatedBy;
}
