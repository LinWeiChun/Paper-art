package com.paperart.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

  @NotBlank(message = "請輸入帳號")
  private String username;

  @NotBlank(message = "請輸入密碼")
  private String password;
}
