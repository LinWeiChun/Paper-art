package com.paperart.backend.service.impl;

import com.paperart.backend.dto.request.LoginRequest;
import com.paperart.backend.dto.response.LoginResponse;
import com.paperart.backend.entity.Role;
import com.paperart.backend.entity.User;
import com.paperart.backend.exception.ApiException;
import com.paperart.backend.repository.UserRepository;
import com.paperart.backend.service.AuthService;
import com.paperart.backend.service.LoginAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

  private static final String DUMMY_PASSWORD_HASH =
      "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final LoginAttemptService loginAttemptService;

  @Override
  public LoginResponse login(LoginRequest request, String clientAddress) {
    String normalizedUsername = request.getUsername().trim();
    String attemptKey = normalizedUsername.toLowerCase() + "|" + clientAddress;
    loginAttemptService.checkAllowed(attemptKey);

    User user = userRepository.findByUsername(normalizedUsername).orElse(null);
    String passwordHash = user == null ? DUMMY_PASSWORD_HASH : user.getPassword();
    boolean passwordMatches = passwordEncoder.matches(request.getPassword(), passwordHash);
    boolean valid = user != null && Boolean.TRUE.equals(user.getEnabled()) && passwordMatches;

    if (!valid) {
      loginAttemptService.recordFailure(attemptKey);
      throw new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "帳號或密碼錯誤");
    }

    loginAttemptService.recordSuccess(attemptKey);
    return toResponse(user);
  }

  @Override
  public LoginResponse getCurrentUser(String username) {
    User user =
        userRepository
            .findByUsername(username)
            .filter(User::getEnabled)
            .orElseThrow(
                () -> new ApiException(HttpStatus.UNAUTHORIZED, "SESSION_EXPIRED", "登入已逾期"));
    return toResponse(user);
  }

  private LoginResponse toResponse(User user) {
    return LoginResponse.builder()
        .username(user.getUsername())
        .roles(user.getRoles().stream().map(Role::getName).toList())
        .build();
  }
}
