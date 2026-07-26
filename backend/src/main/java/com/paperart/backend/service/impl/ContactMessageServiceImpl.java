package com.paperart.backend.service.impl;

import com.paperart.backend.dto.request.ContactMessageRequest;
import com.paperart.backend.dto.response.ContactMessageResponse;
import com.paperart.backend.entity.ContactMessage;
import com.paperart.backend.exception.ApiException;
import com.paperart.backend.repository.ContactMessageRepository;
import com.paperart.backend.service.AuditService;
import com.paperart.backend.service.ContactMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class ContactMessageServiceImpl implements ContactMessageService {

  private final ContactMessageRepository contactMessageRepository;
  private final AuditService auditService;

  @Override
  public ContactMessageResponse create(ContactMessageRequest request) {
    validate(request);

    ContactMessage contactMessage = new ContactMessage();
    contactMessage.setName(request.getName().trim());
    contactMessage.setEmail(request.getEmail().trim());
    contactMessage.setPhone(trimToNull(request.getPhone()));
    contactMessage.setSubject(request.getSubject().trim());
    contactMessage.setMessage(request.getMessage().trim());
    contactMessage.setProcessed(false);
    auditService.markCreated(contactMessage);

    contactMessage = contactMessageRepository.save(contactMessage);

    return toResponse(contactMessage);
  }

  @Override
  public Page<ContactMessageResponse> getAll(int page, int size) {
    Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

    return contactMessageRepository.findAll(pageable).map(this::toResponse);
  }

  @Override
  public ContactMessageResponse getById(String id) {
    ContactMessage contactMessage =
        contactMessageRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new ApiException(HttpStatus.NOT_FOUND, "CONTACT_MESSAGE_NOT_FOUND", "找不到聯絡訊息"));

    return toResponse(contactMessage);
  }

  @Override
  public ContactMessageResponse updateProcessed(String id, Boolean processed) {
    ContactMessage contactMessage =
        contactMessageRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new ApiException(HttpStatus.NOT_FOUND, "CONTACT_MESSAGE_NOT_FOUND", "找不到聯絡訊息"));

    contactMessage.setProcessed(Boolean.TRUE.equals(processed));
    auditService.markUpdated(contactMessage);
    contactMessage = contactMessageRepository.save(contactMessage);

    return toResponse(contactMessage);
  }

  private void validate(ContactMessageRequest request) {
    if (request == null
        || !StringUtils.hasText(request.getName())
        || !StringUtils.hasText(request.getEmail())
        || !StringUtils.hasText(request.getSubject())
        || !StringUtils.hasText(request.getMessage())) {
      throw new IllegalArgumentException("Name, email, subject and message are required");
    }
  }

  private String trimToNull(String value) {
    return StringUtils.hasText(value) ? value.trim() : null;
  }

  private ContactMessageResponse toResponse(ContactMessage contactMessage) {
    return ContactMessageResponse.builder()
        .id(contactMessage.getId())
        .name(contactMessage.getName())
        .email(contactMessage.getEmail())
        .phone(contactMessage.getPhone())
        .subject(contactMessage.getSubject())
        .message(contactMessage.getMessage())
        .processed(contactMessage.getProcessed())
        .createdAt(contactMessage.getCreatedAt())
        .createdBy(auditService.toResponse(contactMessage.getCreatedBy()))
        .updatedBy(auditService.toResponse(contactMessage.getUpdatedBy()))
        .build();
  }
}
