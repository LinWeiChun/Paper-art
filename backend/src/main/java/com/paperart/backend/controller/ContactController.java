package com.paperart.backend.controller;

import com.paperart.backend.dto.request.ContactRequest;
import com.paperart.backend.dto.response.ContactResponse;
import com.paperart.backend.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/contact")
@RequiredArgsConstructor
public class ContactController {

  private final ContactService contactService;

  @GetMapping
  public ContactResponse getContact() {
    return contactService.getContact();
  }

  @PutMapping
  public ContactResponse updateContact(@RequestBody ContactRequest request) {
    return contactService.update(request);
  }
}
