package com.paperart.backend.service;

import com.paperart.backend.dto.request.AuthorRequest;
import com.paperart.backend.dto.response.AuthorResponse;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface AuthorService {

  // 全部作者
  List<AuthorResponse> getAll();

  // 分頁作者
  Page<AuthorResponse> getAll(int page, int size);

  AuthorResponse getById(String id);

  AuthorResponse create(AuthorRequest request, MultipartFile avatar);

  AuthorResponse update(String id, AuthorRequest request, MultipartFile avatar);

  void delete(String id);
}
