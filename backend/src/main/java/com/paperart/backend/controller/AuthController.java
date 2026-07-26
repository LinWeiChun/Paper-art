package com.paperart.backend.controller;

import com.paperart.backend.dto.request.LoginRequest;
import com.paperart.backend.dto.response.LoginResponse;
import com.paperart.backend.exception.ApiException;
import com.paperart.backend.service.AuthCookieService;
import com.paperart.backend.service.AuthService;
import com.paperart.backend.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;
  private final JwtService jwtService;
  private final AuthCookieService authCookieService;

  @PostMapping("/login")
  public ResponseEntity<LoginResponse> login(
      @Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
    LoginResponse response = authService.login(request, resolveClientAddress(httpRequest));
    String token = jwtService.generateToken(response.getUsername());

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, authCookieService.create(token).toString())
        .body(response);
  }

  @PostMapping("/logout")
  public ResponseEntity<Void> logout() {
    return ResponseEntity.noContent()
        .header(HttpHeaders.SET_COOKIE, authCookieService.clear().toString())
        .build();
  }

  @GetMapping("/me")
  public ResponseEntity<LoginResponse> me(Principal principal) {
    if (principal == null) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "SESSION_EXPIRED", "登入已逾期");
    }
    return ResponseEntity.ok(authService.getCurrentUser(principal.getName()));
  }

  @GetMapping("/csrf")
  public Map<String, String> csrf(CsrfToken csrfToken) {
    return Map.of("token", csrfToken.getToken());
  }

  private String resolveClientAddress(HttpServletRequest request) {
    String cloudflareAddress = request.getHeader("CF-Connecting-IP");
    if (cloudflareAddress != null && !cloudflareAddress.isBlank()) {
      return cloudflareAddress.trim();
    }
    return request.getRemoteAddr();
  }
}
