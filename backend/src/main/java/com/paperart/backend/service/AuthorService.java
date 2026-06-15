package com.paperart.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.paperart.backend.dto.request.AuthorRequest;
import com.paperart.backend.dto.response.AuthorResponse;

public interface AuthorService {
	
	Page<AuthorResponse> getAllAuthors(int page, int size);

    AuthorResponse getAuthorById(String id);

    AuthorResponse createAuthor(
            AuthorRequest request,
            MultipartFile avatar);

    AuthorResponse updateAuthor(
            String id,
            AuthorRequest request,
            MultipartFile avatar);

    void deleteAuthor(String id);
}
