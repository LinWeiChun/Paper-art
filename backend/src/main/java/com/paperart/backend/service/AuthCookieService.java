package com.paperart.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
public class AuthCookieService {

  private final String cookieName;
  private final boolean secure;
  private final String sameSite;

  public AuthCookieService(
      @Value("${jwt.cookie-name:PAPERART_SESSION}") String cookieName,
      @Value("${jwt.cookie-secure:true}") boolean secure,
      @Value("${jwt.cookie-same-site:Lax}") String sameSite) {
    this.cookieName = cookieName;
    this.secure = secure;
    this.sameSite = sameSite;
  }

  public String getCookieName() {
    return cookieName;
  }

  public ResponseCookie create(String token) {
    return ResponseCookie.from(cookieName, token)
        .httpOnly(true)
        .secure(secure)
        .sameSite(sameSite)
        .path("/")
        .build();
  }

  public ResponseCookie clear() {
    return ResponseCookie.from(cookieName, "")
        .httpOnly(true)
        .secure(secure)
        .sameSite(sameSite)
        .path("/")
        .maxAge(0)
        .build();
  }
}
