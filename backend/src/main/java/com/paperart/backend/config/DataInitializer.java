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

  @Value("${admin.sync-password:false}")
  private boolean syncAdminPassword;

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

      Role adminRole =
          roleRepository
              .findByName("ADMIN")
              .orElseGet(
                  () -> {
                    Role role = new Role();
                    role.setName("ADMIN");
                    return roleRepository.save(role);
                  });
      adminRoles.add(adminRole);

      User admin =
          userRepository
              .findByUsername(adminUsername)
              .orElseGet(
                  () -> {
                    User user = new User();
                    user.setUsername(adminUsername);
                    user.setPassword(passwordEncoder.encode(adminPassword));
                    return user;
                  });

      boolean adminPasswordChanged = synchronizeAdminPassword(admin);
      Set<String> existingRoleNames =
          admin.getRoles().stream().map(Role::getName).collect(java.util.stream.Collectors.toSet());
      Set<String> requiredRoleNames =
          adminRoles.stream().map(Role::getName).collect(java.util.stream.Collectors.toSet());

      if (admin.getId() == null
          || adminPasswordChanged
          || !existingRoleNames.containsAll(requiredRoleNames)) {
        admin.setRoles(adminRoles);
        userRepository.save(admin);
      }
    };
  }

  boolean synchronizeAdminPassword(User admin) {
    if (!syncAdminPassword || passwordEncoder.matches(adminPassword, admin.getPassword())) {
      return false;
    }

    admin.setPassword(passwordEncoder.encode(adminPassword));
    return true;
  }
}
