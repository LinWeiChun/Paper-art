package com.paperart.backend.service;

import com.paperart.backend.dto.request.BannerRequest;
import com.paperart.backend.dto.response.BannerResponse;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface BannerService {

    List<BannerResponse> getAll();
    List<BannerResponse> getByActiveTrueOrderBySortOrderAsc();
    BannerResponse getById(String id);

    BannerResponse create(BannerRequest request,
            MultipartFile image);

    BannerResponse update(String id,
            BannerRequest request,
            MultipartFile image);

    void delete(String id);
}