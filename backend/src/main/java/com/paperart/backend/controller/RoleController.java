package com.paperart.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paperart.backend.service.RoleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    public List<String> getAllRoles() {

        return roleService.getAllRoles();
    }

}