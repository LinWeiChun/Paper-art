package com.paperart.backend.config;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.paperart.backend.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

class DataInitializerTests {

  private BCryptPasswordEncoder passwordEncoder;
  private DataInitializer dataInitializer;
  private User existingAdmin;

  @BeforeEach
  void setUp() {
    passwordEncoder = new BCryptPasswordEncoder();
    dataInitializer = new DataInitializer(null, null, passwordEncoder);
    ReflectionTestUtils.setField(dataInitializer, "adminPassword", "new-password");

    existingAdmin = new User();
    existingAdmin.setPassword(passwordEncoder.encode("old-password"));
  }

  @Test
  void synchronizesExistingAdminPasswordWhenEnabled() {
    ReflectionTestUtils.setField(dataInitializer, "syncAdminPassword", true);

    boolean passwordChanged = dataInitializer.synchronizeAdminPassword(existingAdmin);

    assertTrue(passwordChanged);
    assertTrue(passwordEncoder.matches("new-password", existingAdmin.getPassword()));
  }

  @Test
  void preservesExistingAdminPasswordWhenSynchronizationIsDisabled() {
    ReflectionTestUtils.setField(dataInitializer, "syncAdminPassword", false);

    boolean passwordChanged = dataInitializer.synchronizeAdminPassword(existingAdmin);

    assertFalse(passwordChanged);
    assertTrue(passwordEncoder.matches("old-password", existingAdmin.getPassword()));
  }
}
