package com.paperart.backend.service;

import com.paperart.backend.dto.request.ContactRequest;
import com.paperart.backend.dto.response.ContactResponse;

public interface ContactService {

    ContactResponse getContact();

    ContactResponse update(ContactRequest request);
}