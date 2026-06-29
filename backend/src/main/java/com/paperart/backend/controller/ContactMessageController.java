package com.paperart.backend.controller;

import com.paperart.backend.dto.request.ContactMessageRequest;
import com.paperart.backend.dto.response.ContactMessageResponse;
import com.paperart.backend.service.ContactMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/contact-messages")
@RequiredArgsConstructor
public class ContactMessageController {

  private final ContactMessageService contactMessageService;

  @PostMapping
  public ContactMessageResponse create(@RequestBody ContactMessageRequest request) {
    return contactMessageService.create(request);
  }

  @GetMapping
  public Page<ContactMessageResponse> getAll(
      @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
    return contactMessageService.getAll(page, size);
  }

  @GetMapping("/{id}")
  public ContactMessageResponse getById(@PathVariable String id) {
    return contactMessageService.getById(id);
  }

  @PutMapping("/{id}/processed")
  public ContactMessageResponse updateProcessed(
      @PathVariable String id, @RequestBody ContactMessageRequest request) {
    return contactMessageService.updateProcessed(id, Boolean.TRUE.equals(request.getProcessed()));
  }
}
