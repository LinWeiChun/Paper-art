package com.paperart.backend.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.paperart.backend.dto.request.LoginRequest;
import com.paperart.backend.dto.response.LoginResponse;
import com.paperart.backend.entity.User;
import com.paperart.backend.repository.UserRepository;
import com.paperart.backend.service.AuthService;
import com.paperart.backend.service.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("帳號不存在"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {

            throw new RuntimeException("密碼錯誤");
        }

        return LoginResponse.builder()
                .token(jwtService.generateToken(user.getUsername()))
                .username(user.getUsername())
                .role(user.getRole().getName())
                .build();
    }
}
