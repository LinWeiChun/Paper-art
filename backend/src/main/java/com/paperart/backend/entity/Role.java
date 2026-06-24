package com.paperart.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "roles")
@Getter
@Setter
public class Role extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name;
}