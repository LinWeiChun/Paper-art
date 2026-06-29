package com.paperart.backend.service;

import com.paperart.backend.dto.request.ContactMessageRequest;
import com.paperart.backend.dto.response.ContactMessageResponse;
import org.springframework.data.domain.Page;

public interface ContactMessageService {

  ContactMessageResponse create(ContactMessageRequest request);

  Page<ContactMessageResponse> getAll(int page, int size);

  ContactMessageResponse getById(String id);

  ContactMessageResponse updateProcessed(String id, Boolean processed);
}
