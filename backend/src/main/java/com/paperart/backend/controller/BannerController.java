package com.paperart.backend.controller;

import com.paperart.backend.dto.request.BannerRequest;
import com.paperart.backend.dto.response.BannerResponse;
import com.paperart.backend.service.BannerService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    @GetMapping
    public List<BannerResponse> getAll() {
        return bannerService.getByActiveTrueOrderBySortOrderAsc();
    }
    
    @GetMapping("/admin")
    public List<BannerResponse> getAllAdmin() {
        return bannerService.getAll();
    }

    @GetMapping("/{id}")
    public BannerResponse getById(@PathVariable String id) {
        return bannerService.getById(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BannerResponse> create(
            @RequestPart BannerRequest request,
            @RequestPart(required = false) MultipartFile image
    ) {

        return ResponseEntity.ok(
                bannerService.create(request, image)
        );
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<BannerResponse> update(
            @PathVariable String id,
            @RequestPart BannerRequest request,
            @RequestPart(required = false) MultipartFile image
    ) {

        return ResponseEntity.ok(
                bannerService.update(id, request, image)
        );
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        bannerService.delete(id);
    }
}