package com.paperart.backend.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.paperart.backend.dto.request.TagRequest;
import com.paperart.backend.dto.response.TagResponse;

public interface TagService {

    Page<TagResponse> getAll(int page, int size);

    List<TagResponse> getAll();
    
    TagResponse getById(String id);

    TagResponse create(TagRequest request);

    TagResponse update(String id, TagRequest request);

    void delete(String id);
}