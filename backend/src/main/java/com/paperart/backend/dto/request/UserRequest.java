package com.paperart.backend.dto.request;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequest {

  private String username;

  private String password;

  private Boolean enabled;

  private List<String> roles;
}
