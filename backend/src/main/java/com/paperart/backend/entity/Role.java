package com.paperart.backend.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "roles")
@Getter
@Setter
public class Role extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "role")
    private List<User> users = new ArrayList<>();
}