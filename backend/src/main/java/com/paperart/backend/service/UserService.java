package com.paperart.backend.service;

import java.util.List;

import com.paperart.backend.dto.request.UserRequest;
import com.paperart.backend.dto.response.UserResponse;

public interface UserService {

    List<UserResponse> getAllUsers();

    UserResponse getUserById(String id);

    UserResponse createUser(UserRequest request);

    UserResponse updateUser(
            String id,
            UserRequest request
    );

    void disableUser(String id);

    void enableUser(String id);

    void deleteUser(String id);
}
