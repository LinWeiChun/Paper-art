package com.paperart.backend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.paperart.backend.repository.RoleRepository;
import com.paperart.backend.service.RoleService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    public List<String> getAllRoles() {

        return roleRepository.findAll()
                .stream()
                .map(role -> role.getName())
                .toList();
    }
}