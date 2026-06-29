package com.paperart.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContactMessageRequest {

  private String name;

  private String email;

  private String phone;

  private String subject;

  private String message;

  private Boolean processed;
}
