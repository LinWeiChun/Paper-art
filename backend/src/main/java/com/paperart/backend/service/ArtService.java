package com.paperart.backend.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.paperart.backend.dto.request.ArtRequest;
import com.paperart.backend.dto.response.ArtResponse;

public interface ArtService {

    List<ArtResponse> getAll();

    Page<ArtResponse> getAll(int page, int size);

    ArtResponse getById(String id);

    ArtResponse create(
            ArtRequest request,
            MultipartFile thumbnail);

    ArtResponse update(
            String id,
            ArtRequest request,
            MultipartFile thumbnail);

    void delete(String id);
}