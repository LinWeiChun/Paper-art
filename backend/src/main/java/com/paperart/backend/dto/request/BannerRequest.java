package com.paperart.backend.dto.request;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BannerRequest {

    private String title;

    private String subtitle;

    private MultipartFile image;

    private Integer sortOrder;

    private Boolean active;
}