package com.paperart.backend.service.impl;

import com.paperart.backend.dto.request.TagRequest;
import com.paperart.backend.dto.response.TagResponse;
import com.paperart.backend.entity.Tag;
import com.paperart.backend.repository.TagRepository;
import com.paperart.backend.service.TagService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

  private final TagRepository tagRepository;

  @Override
  public Page<TagResponse> getAll(int page, int size) {

    Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

    return tagRepository.findAll(pageable).map(this::toResponse);
  }

  @Override
  public List<TagResponse> getAll() {
    return tagRepository.findAll().stream().map(this::toResponse).toList();
  }

  @Override
  public TagResponse getById(String id) {

    Tag tag = tagRepository.findById(id).orElseThrow(() -> new RuntimeException("分類不存在"));

    return toResponse(tag);
  }

  @Override
  public TagResponse create(TagRequest request) {

    Tag tag = new Tag();

    tag.setName(request.getName());

    return toResponse(tagRepository.save(tag));
  }

  @Override
  public TagResponse update(String id, TagRequest request) {

    Tag tag = tagRepository.findById(id).orElseThrow(() -> new RuntimeException("分類不存在"));

    tag.setName(request.getName());

    return toResponse(tagRepository.save(tag));
  }

  @Override
  public void delete(String id) {
    tagRepository.deleteById(id);
  }

  private TagResponse toResponse(Tag tag) {

    return TagResponse.builder().id(tag.getId()).name(tag.getName()).build();
  }
}
