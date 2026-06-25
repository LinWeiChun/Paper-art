package com.paperart.backend.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ContactResponse {

    private String id;

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