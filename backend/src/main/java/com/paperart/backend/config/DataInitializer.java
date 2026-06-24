package com.paperart.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.paperart.backend.entity.Role;
import com.paperart.backend.entity.User;
import com.paperart.backend.repository.RoleRepository;
import com.paperart.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;
    
    @Bean
    public CommandLineRunner init() {

        return args -> {

            // 建立 ADMIN Role
            Role adminRole = roleRepository
                    .findByName("ADMIN")
                    .orElseGet(() -> {

                        Role role = new Role();
                        role.setName("ADMIN");

                        return roleRepository.save(role);
                    });

            // 建立 admin 帳號
            if (!userRepository.existsByUsername("admin")) {

                User admin = new User();

                admin.setUsername(adminUsername);
                admin.setPassword(
                        passwordEncoder.encode(adminPassword)
                );
                admin.setRole(adminRole);

                userRepository.save(admin);
            }
        };
    }
}