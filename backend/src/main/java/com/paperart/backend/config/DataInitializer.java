package com.paperart.backend.config;

import com.paperart.backend.entity.Role;
import com.paperart.backend.entity.User;
import com.paperart.backend.enums.Permission;
import com.paperart.backend.repository.RoleRepository;
import com.paperart.backend.repository.UserRepository;
import java.util.HashSet;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

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

      // 建立所有權限
      Set<Role> adminRoles = new HashSet<>();

      for (Permission permission : Permission.values()) {

        Role role =
            roleRepository
                .findByName(permission.name())
                .orElseGet(
                    () -> {
                      Role newRole = new Role();
                      newRole.setName(permission.name());

                      return roleRepository.save(newRole);
                    });

        adminRoles.add(role);
      }

      // 建立 admin 帳號
      if (!userRepository.existsByUsername(adminUsername)) {

        User admin = new User();

        admin.setUsername(adminUsername);

        admin.setPassword(passwordEncoder.encode(adminPassword));

        admin.setRoles(adminRoles);

        userRepository.save(admin);
      }
    };
  }
}
