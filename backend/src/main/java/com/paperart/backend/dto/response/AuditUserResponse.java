package com.paperart.backend.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuditUserResponse {

  private String id;

  private String username;
}
