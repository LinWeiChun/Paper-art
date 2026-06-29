package com.paperart.backend.service.impl;

import com.paperart.backend.dto.request.AboutRequest;
import com.paperart.backend.dto.request.AboutValueRequest;
import com.paperart.backend.dto.response.AboutResponse;
import com.paperart.backend.dto.response.AboutValueResponse;
import com.paperart.backend.entity.About;
import com.paperart.backend.entity.AboutValue;
import com.paperart.backend.repository.AboutRepository;
import com.paperart.backend.service.AboutService;
import com.paperart.backend.service.AuditService;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AboutServiceImpl implements AboutService {

  private final AboutRepository aboutRepository;
  private final AuditService auditService;

  @Override
  public AboutResponse getAbout() {

    About about =
        aboutRepository.findAll().stream()
            .findFirst()
            .orElseGet(
                () -> {
                  About newAbout = new About();
                  newAbout.setBannerTitle("關於我們");
                  newAbout.setBannerSubtitle("傳承剪紙文化，延續匠人精神");
                  return aboutRepository.save(newAbout);
                });

    return toResponse(about);
  }

  @Override
  @Transactional
  public AboutResponse updateAbout(AboutRequest request) {

    About about =
        aboutRepository.findAll().stream().findFirst().orElseGet(this::createDefaultAbout);

    about.setBannerTitle(request.getBannerTitle());
    about.setBannerSubtitle(request.getBannerSubtitle());
    about.setStoryTitle(request.getStoryTitle());
    about.setStoryContent(request.getStoryContent());
    about.setVision(request.getVision());

    if (about.getId() == null) {
      auditService.markCreated(about);
    } else {
      auditService.markUpdated(about);
    }

    // 清空原本 values
    about.getValues().clear();

    // 重新加入
    for (AboutValueRequest valueRequest : request.getValues()) {

      AboutValue value = new AboutValue();

      value.setTitle(valueRequest.getTitle());
      value.setDescription(valueRequest.getDescription());
      value.setSortOrder(valueRequest.getSortOrder());

      value.setAbout(about);
      auditService.markCreated(value);

      about.getValues().add(value);
    }

    aboutRepository.save(about);

    return toResponse(about);
  }

  private AboutResponse toResponse(About about) {

    return AboutResponse.builder()
        .id(about.getId())
        .bannerTitle(about.getBannerTitle())
        .bannerSubtitle(about.getBannerSubtitle())
        .storyTitle(about.getStoryTitle())
        .storyContent(about.getStoryContent())
        .vision(about.getVision())
        .values(
            about.getValues().stream()
                .map(
                    value ->
                        AboutValueResponse.builder()
                            .id(value.getId())
                            .title(value.getTitle())
                            .description(value.getDescription())
                            .sortOrder(value.getSortOrder())
                            .createdBy(auditService.toResponse(value.getCreatedBy()))
                            .updatedBy(auditService.toResponse(value.getUpdatedBy()))
                            .build())
                .collect(Collectors.toList()))
        .createdBy(auditService.toResponse(about.getCreatedBy()))
        .updatedBy(auditService.toResponse(about.getUpdatedBy()))
        .build();
  }

  private About createDefaultAbout() {
    About about = new About();
    about.setBannerTitle("關於我們");
    about.setBannerSubtitle("傳承剪紙文化，延續匠人精神");

    return about;
  }
}
