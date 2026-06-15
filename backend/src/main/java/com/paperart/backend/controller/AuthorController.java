package com.paperart.backend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.paperart.backend.dto.request.AuthorRequest;
import com.paperart.backend.dto.response.AuthorResponse;
import com.paperart.backend.service.AuthorService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/authors")
@RequiredArgsConstructor
public class AuthorController {

    private final AuthorService authorService;

    @GetMapping
    public Page<AuthorResponse> getAllAuthors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return authorService.getAllAuthors(page, size);
    }

    @GetMapping("/{id}")
    public AuthorResponse getAuthorById(
            @PathVariable String id) {

        return authorService.getAuthorById(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public AuthorResponse createAuthor(

            @RequestPart("data")
            AuthorRequest request,

            @RequestPart(value = "avatar", required = false)
            MultipartFile avatar) {

        return authorService.createAuthor(request, avatar);
    }

    @PutMapping(value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public AuthorResponse updateAuthor(

            @PathVariable String id,

            @RequestPart("data")
            AuthorRequest request,

            @RequestPart(value = "avatar", required = false)
            MultipartFile avatar) {

        return authorService.updateAuthor(id, request, avatar);
    }

    @DeleteMapping("/{id}")
    public void deleteAuthor(
            @PathVariable String id) {

        authorService.deleteAuthor(id);
    }
}
