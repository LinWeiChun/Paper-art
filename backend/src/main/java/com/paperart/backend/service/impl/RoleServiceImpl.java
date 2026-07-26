package com.paperart.backend.service.impl;

import com.paperart.backend.repository.RoleRepository;
import com.paperart.backend.service.RoleService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

  private final RoleRepository roleRepository;

  @Override
  public List<String> getAllRoles() {

    return roleRepository.findAll().stream()
        .map(role -> role.getName())
        .filter(name -> !"ADMIN".equals(name))
        .toList();
  }
}
