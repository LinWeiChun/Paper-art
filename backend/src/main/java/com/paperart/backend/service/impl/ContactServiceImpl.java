package com.paperart.backend.service.impl;

import com.paperart.backend.dto.request.ContactRequest;
import com.paperart.backend.dto.response.ContactResponse;
import com.paperart.backend.entity.Contact;
import com.paperart.backend.repository.ContactRepository;
import com.paperart.backend.service.AuditService;
import com.paperart.backend.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

  private final ContactRepository contactRepository;
  private final AuditService auditService;

  @Override
  public ContactResponse getContact() {

    Contact contact =
        contactRepository.findAll().stream()
            .findFirst()
            .orElseGet(() -> contactRepository.save(new Contact()));

    return toResponse(contact);
  }

  @Override
  public ContactResponse update(ContactRequest request) {

    Contact contact =
        contactRepository.findAll().stream().findFirst().orElseGet(Contact::new);

    contact.setContactPerson(request.getContactPerson());
    contact.setPhone(request.getPhone());
    contact.setMobile(request.getMobile());
    contact.setEmail(request.getEmail());
    contact.setAddress(request.getAddress());
    contact.setFacebook(request.getFacebook());
    contact.setInstagram(request.getInstagram());
    contact.setLine(request.getLine());
    contact.setWebsite(request.getWebsite());
    contact.setBusinessHours(request.getBusinessHours());
    contact.setGoogleMap(request.getGoogleMap());

    if (contact.getId() == null) {
      auditService.markCreated(contact);
    } else {
      auditService.markUpdated(contact);
    }

    contact = contactRepository.save(contact);

    return toResponse(contact);
  }

  private ContactResponse toResponse(Contact contact) {

    return ContactResponse.builder()
        .id(contact.getId())
        .contactPerson(contact.getContactPerson())
        .phone(contact.getPhone())
        .mobile(contact.getMobile())
        .email(contact.getEmail())
        .address(contact.getAddress())
        .facebook(contact.getFacebook())
        .instagram(contact.getInstagram())
        .line(contact.getLine())
        .website(contact.getWebsite())
        .businessHours(contact.getBusinessHours())
        .googleMap(contact.getGoogleMap())
        .createdBy(auditService.toResponse(contact.getCreatedBy()))
        .updatedBy(auditService.toResponse(contact.getUpdatedBy()))
        .build();
  }
}
