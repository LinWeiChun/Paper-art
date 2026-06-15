package com.paperart.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthorRequest {

    private String name;

    private String title;

    private String description;

    private Integer sortOrder;
}