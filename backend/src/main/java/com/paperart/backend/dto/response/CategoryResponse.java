package com.paperart.backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CategoryResponse {

  private String id;

  private String name;

  private Integer sortOrder;

  private Boolean published;

  private AuditUserResponse createdBy;

  private AuditUserResponse updatedBy;
}
