package com.paperart.backend.service.impl;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.paperart.backend.dto.request.UserRequest;
import com.paperart.backend.dto.response.UserResponse;
import com.paperart.backend.entity.Role;
import com.paperart.backend.entity.User;
import com.paperart.backend.repository.RoleRepository;
import com.paperart.backend.repository.UserRepository;
import com.paperart.backend.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public UserResponse getUserById(String id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("使用者不存在"));

        return convertToResponse(user);
    }

    @Override
    public UserResponse createUser(UserRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("帳號已存在");
        }

        User user = new User();

        user.setUsername(request.getUsername());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setEnabled(
                request.getEnabled() != null
                        ? request.getEnabled()
                        : true
        );

        if (request.getRoles() != null) {

            Set<Role> roles = request.getRoles()
                    .stream()
                    .map(roleName ->
                            roleRepository.findByName(roleName)
                                    .orElseThrow(() ->
                                            new RuntimeException("權限不存在"))
                    )
                    .collect(Collectors.toSet());

            user.setRoles(roles);
        }

        userRepository.save(user);

        return convertToResponse(user);
    }

    @Override
    public UserResponse updateUser(
            String id,
            UserRequest request
    ) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("使用者不存在"));

        // 是否啟用
        if (request.getEnabled() != null) {
            user.setEnabled(request.getEnabled());
        }

        // 修改密碼
        if (request.getPassword() != null
                && !request.getPassword().isBlank()) {

            user.setPassword(
                    passwordEncoder.encode(request.getPassword())
            );
        }

        // 修改權限
        if (request.getRoles() != null) {

            Set<Role> roles = request.getRoles()
                    .stream()
                    .map(roleName ->
                            roleRepository.findByName(roleName)
                                    .orElseThrow(() ->
                                            new RuntimeException("權限不存在"))
                    )
                    .collect(Collectors.toSet());

            user.setRoles(roles);
        }

        userRepository.save(user);

        return convertToResponse(user);
    }

    @Override
    public void disableUser(String id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("使用者不存在"));

        user.setEnabled(false);

        userRepository.save(user);
    }

    @Override
    public void enableUser(String id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("使用者不存在"));

        user.setEnabled(true);

        userRepository.save(user);
    }

    @Override
    public void deleteUser(String id) {
        disableUser(id);
    }

    private UserResponse convertToResponse(User user) {

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .enabled(user.getEnabled())
                .roles(
                        user.getRoles()
                                .stream()
                                .map(Role::getName)
                                .toList()
                )
                .build();
    }
}