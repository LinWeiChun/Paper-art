package com.paperart.backend.service.impl;

import com.paperart.backend.dto.request.BannerRequest;
import com.paperart.backend.dto.response.BannerResponse;
import com.paperart.backend.dto.response.UploadResponse;
import com.paperart.backend.entity.Banner;
import com.paperart.backend.exception.ApiException;
import com.paperart.backend.repository.BannerRepository;
import com.paperart.backend.service.AuditService;
import com.paperart.backend.service.BannerService;
import com.paperart.backend.service.FileUploadService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class BannerServiceImpl implements BannerService {

  private final BannerRepository bannerRepository;
  private final FileUploadService fileUploadService;
  private final AuditService auditService;

  @Override
  public List<BannerResponse> getAll() {
    return bannerRepository.findByDeletedFalseOrderBySortOrderAsc().stream()
        .map(this::toResponse)
        .toList();
  }

  @Override
  public List<BannerResponse> getByActiveTrueOrderBySortOrderAsc() {
    return bannerRepository.findByActiveTrueAndDeletedFalseOrderBySortOrderAsc().stream()
        .map(this::toResponse)
        .toList();
  }

  @Override
  public BannerResponse getById(String id) {

    Banner banner = findActiveBanner(id);

    if (!Boolean.TRUE.equals(banner.getActive())) {
      throw new ApiException(HttpStatus.NOT_FOUND, "BANNER_NOT_FOUND", "找不到輪播項目");
    }

    return toResponse(banner);
  }

  @Override
  public BannerResponse getAdminById(String id) {

    Banner banner = findActiveBanner(id);

    return toResponse(banner);
  }

  @Override
  public BannerResponse create(BannerRequest request, MultipartFile image) {

    Banner banner = new Banner();

    banner.setTitle(request.getTitle());
    banner.setSubtitle(request.getSubtitle());
    banner.setSortOrder(resolveCreateSortOrder(request.getSortOrder()));
    banner.setActive(request.getActive());
    auditService.markCreated(banner);

    if (image != null && !image.isEmpty()) {

      UploadResponse uploadResponse = fileUploadService.upload(image, "banners/");

      banner.setImage(uploadResponse.getUrl());
    }

    return toResponse(bannerRepository.save(banner));
  }

  @Override
  public BannerResponse update(String id, BannerRequest request, MultipartFile image) {

    Banner banner = findActiveBanner(id);

    banner.setTitle(request.getTitle());
    banner.setSubtitle(request.getSubtitle());
    banner.setSortOrder(request.getSortOrder());
    banner.setActive(request.getActive());
    auditService.markUpdated(banner);

    if (image != null && !image.isEmpty()) {
      String oldImage = banner.getImage();

      UploadResponse uploadResponse = fileUploadService.upload(image, "banners/");

      banner.setImage(uploadResponse.getUrl());
      fileUploadService.moveToDeleteFolder(oldImage);
    }

    return toResponse(bannerRepository.save(banner));
  }

  @Override
  public void delete(String id) {

    Banner banner = findActiveBanner(id);

    fileUploadService.moveToDeleteFolder(banner.getImage());
    auditService.markDeleted(banner);
    bannerRepository.save(banner);
  }

  private BannerResponse toResponse(Banner banner) {

    return BannerResponse.builder()
        .id(banner.getId())
        .title(banner.getTitle())
        .subtitle(banner.getSubtitle())
        .image(banner.getImage())
        .sortOrder(banner.getSortOrder())
        .active(banner.getActive())
        .createdBy(auditService.toResponse(banner.getCreatedBy()))
        .updatedBy(auditService.toResponse(banner.getUpdatedBy()))
        .build();
  }

  private Banner findActiveBanner(String id) {
    Banner banner =
        bannerRepository
            .findById(id)
            .orElseThrow(
                () -> new ApiException(HttpStatus.NOT_FOUND, "BANNER_NOT_FOUND", "找不到輪播項目"));

    if (Boolean.TRUE.equals(banner.getDeleted())) {
      throw new ApiException(HttpStatus.NOT_FOUND, "BANNER_NOT_FOUND", "找不到輪播項目");
    }

    return banner;
  }

  private Integer resolveCreateSortOrder(Integer sortOrder) {
    if (sortOrder != null && sortOrder > 0) {
      return sortOrder;
    }

    return bannerRepository.findMaxSortOrderByDeletedFalse() + 1;
  }
}
