package com.paperart.backend.dto.response;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ContactMessageResponse {

  private String id;

  private String name;

  private String email;

  private String phone;

  private String subject;

  private String message;

  private Boolean processed;

  private LocalDateTime createdAt;

  private AuditUserResponse createdBy;

  private AuditUserResponse updatedBy;
}
