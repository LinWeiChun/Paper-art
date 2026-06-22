package com.paperart.backend.service.impl;

import com.paperart.backend.dto.request.BannerRequest;
import com.paperart.backend.dto.response.BannerResponse;
import com.paperart.backend.entity.Banner;
import com.paperart.backend.repository.BannerRepository;
import com.paperart.backend.service.BannerService;
import com.paperart.backend.service.FileUploadService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BannerServiceImpl implements BannerService {
	
	private final BannerRepository bannerRepository;
	private final FileUploadService fileUploadService;
	
    @Override
    public List<BannerResponse> getAll() {
        return bannerRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }
    @Override
    public List<BannerResponse> getByActiveTrueOrderBySortOrderAsc() {
        return bannerRepository.findByActiveTrueOrderBySortOrderAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }
    @Override
    public BannerResponse getById(String id) {

        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banner 不存在"));

        return toResponse(banner);
    }

    @Override
    public BannerResponse create(
            BannerRequest request,
            MultipartFile image
    ) {

        Banner banner = new Banner();

        banner.setTitle(request.getTitle());
        banner.setSubtitle(request.getSubtitle());
        banner.setSortOrder(request.getSortOrder());
        banner.setActive(request.getActive());

        // 上傳圖片
        if (image != null && !image.isEmpty()) {

            String imageUrl =
                    fileUploadService.upload(image, "banners/");

            banner.setImage(imageUrl);
        }

        return toResponse(
                bannerRepository.save(banner)
        );
    }

    @Override
    public BannerResponse update(
            String id,
            BannerRequest request,
            MultipartFile image
    ) {

        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Banner 不存在"));

        banner.setTitle(request.getTitle());
        banner.setSubtitle(request.getSubtitle());
        banner.setSortOrder(request.getSortOrder());
        banner.setActive(request.getActive());

        if (image != null && !image.isEmpty()) {

            String imageUrl =
                    fileUploadService.upload(image, "banners/");

            banner.setImage(imageUrl);
        }

        return toResponse(
                bannerRepository.save(banner)
        );
    }

    @Override
    public void delete(String id) {

        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banner 不存在"));

        bannerRepository.delete(banner);
    }

    private BannerResponse toResponse(Banner banner) {

        return BannerResponse.builder()
                .id(banner.getId())
                .title(banner.getTitle())
                .subtitle(banner.getSubtitle())
                .image(banner.getImage())
                .sortOrder(banner.getSortOrder())
                .active(banner.getActive())
                .build();
    }
}