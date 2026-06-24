package com.paperart.backend.repository;

import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;

import com.paperart.backend.entity.Role;

public interface RoleRepository extends JpaRepository<Role, String> {

    Optional<Role> findByName(String name);

}
