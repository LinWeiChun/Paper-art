package com.paperart.backend.service;

import com.paperart.backend.dto.response.AuditUserResponse;
import com.paperart.backend.entity.BaseEntity;
import com.paperart.backend.entity.User;
import com.paperart.backend.repository.UserRepository;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditService {

  private final UserRepository userRepository;

  public void markCreated(BaseEntity entity) {
    User currentUser = getCurrentUser();

    if (currentUser == null) {
      return;
    }

    entity.setCreatedBy(currentUser);
    entity.setUpdatedBy(currentUser);
  }

  public void markUpdated(BaseEntity entity) {
    User currentUser = getCurrentUser();

    if (currentUser == null) {
      return;
    }

    entity.setUpdatedBy(currentUser);
  }

  public void markDeleted(BaseEntity entity) {
    entity.setDeleted(true);
    entity.setDeletedAt(LocalDateTime.now());
    markUpdated(entity);
  }

  public AuditUserResponse toResponse(User user) {
    if (user == null) {
      return null;
    }

    return AuditUserResponse.builder().id(user.getId()).username(user.getUsername()).build();
  }

  private User getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null || !authentication.isAuthenticated()) {
      return null;
    }

    String username = getUsername(authentication.getPrincipal());

    if (username == null || username.isBlank()) {
      return null;
    }

    return userRepository.findByUsername(username).orElse(null);
  }

  private String getUsername(Object principal) {
    if (principal instanceof UserDetails userDetails) {
      return userDetails.getUsername();
    }

    if (principal instanceof String username) {
      return username;
    }

    return null;
  }
}
