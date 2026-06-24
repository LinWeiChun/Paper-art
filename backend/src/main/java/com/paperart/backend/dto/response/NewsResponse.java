package com.paperart.backend.dto.response;

import java.time.LocalDate;

import com.paperart.backend.enums.PublishStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsResponse {

    private String id;

    private String title;

    private String content;

    private String summary;

    private String coverImage;

    private Boolean featured;

    private LocalDate publishDate;

    private PublishStatus status;
}