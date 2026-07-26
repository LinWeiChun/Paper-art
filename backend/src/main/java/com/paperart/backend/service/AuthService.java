package com.paperart.backend.service;

import com.paperart.backend.dto.request.LoginRequest;
import com.paperart.backend.dto.response.LoginResponse;

public interface AuthService {

  LoginResponse login(LoginRequest request, String clientAddress);

  LoginResponse getCurrentUser(String username);
}
