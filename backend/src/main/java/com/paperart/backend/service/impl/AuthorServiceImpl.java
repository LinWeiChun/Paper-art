package com.paperart.backend.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.paperart.backend.dto.request.AuthorRequest;
import com.paperart.backend.dto.response.AuthorResponse;
import com.paperart.backend.entity.Author;
import com.paperart.backend.repository.AuthorRepository;
import com.paperart.backend.service.AuthorService;
import com.paperart.backend.service.FileUploadService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthorServiceImpl implements AuthorService {

    private final AuthorRepository authorRepository;
    private final FileUploadService fileUploadService;

    // 前台：全部作者
    @Override
    public List<AuthorResponse> getAll() {

        return authorRepository.findAll(
                Sort.by("sortOrder").ascending()
        )
        .stream()
        .map(this::toResponse)
        .toList();
    }

    // 分頁查詢
    @Override
    public Page<AuthorResponse> getAll(int page, int size) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("sortOrder").ascending()
        );

        return authorRepository.findAll(pageable)
                .map(this::toResponse);
    }

    @Override
    public AuthorResponse getById(String id) {

        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found"));

        return toResponse(author);
    }

    @Override
    public AuthorResponse create(
            AuthorRequest request,
            MultipartFile avatar) {

        Author author = new Author();

        author.setName(request.getName());
        author.setTitle(request.getTitle());
        author.setDescription(request.getDescription());
        author.setSortOrder(request.getSortOrder());

        if (avatar != null && !avatar.isEmpty()) {

            String imageUrl =
                    fileUploadService.upload(avatar, "authors/");

            author.setAvatarUrl(imageUrl);
        }

        return toResponse(authorRepository.save(author));
    }

    @Override
    public AuthorResponse update(
            String id,
            AuthorRequest request,
            MultipartFile avatar) {

        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found"));

        author.setName(request.getName());
        author.setTitle(request.getTitle());
        author.setDescription(request.getDescription());
        author.setSortOrder(request.getSortOrder());

        if (avatar != null && !avatar.isEmpty()) {

            String imageUrl =
                    fileUploadService.upload(avatar, "authors/");

            author.setAvatarUrl(imageUrl);
        }

        return toResponse(authorRepository.save(author));
    }

    @Override
    public void delete(String id) {

        authorRepository.deleteById(id);
    }

    private AuthorResponse toResponse(Author author) {

        return AuthorResponse.builder()
                .id(author.getId())
                .name(author.getName())
                .title(author.getTitle())
                .description(author.getDescription())
                .avatarUrl(author.getAvatarUrl())
                .sortOrder(author.getSortOrder())
                .build();
    }
}