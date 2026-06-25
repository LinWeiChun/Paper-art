package com.paperart.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.paperart.backend.entity.Contact;

public interface ContactRepository
    extends JpaRepository<Contact, String> {
}