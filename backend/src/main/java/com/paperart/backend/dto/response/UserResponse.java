package com.paperart.backend.dto.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {

  private String id;

  private String username;

  private Boolean enabled;

  private List<String> roles;

  private AuditUserResponse createdBy;

  private AuditUserResponse updatedBy;
}
