package com.paperart.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContactRequest {

    private String contactPerson;

    private String phone;

    private String mobile;

    private String email;

    private String address;

    private String facebook;

    private String instagram;

    private String line;

    private String website;

    private String businessHours;

    private String googleMap;
}