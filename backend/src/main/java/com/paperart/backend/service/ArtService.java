package com.paperart.backend.service;

import com.paperart.backend.dto.request.ArtRequest;
import com.paperart.backend.dto.request.ArtSearchRequest;
import com.paperart.backend.dto.response.ArtResponse;
import com.paperart.backend.dto.response.ImportResponse;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface ArtService {

  List<ArtResponse> getAll();

  Page<ArtResponse> getAll(int page, int size);

  Page<ArtResponse> getAdminAll(int page, int size);

  Page<ArtResponse> search(ArtSearchRequest request, int page, int size);

  ArtResponse getById(String id);

  ArtResponse getAdminById(String id);

  ArtResponse create(ArtRequest request, MultipartFile thumbnail);

  ImportResponse importArts(MultipartFile file);

  ArtResponse update(String id, ArtRequest request, MultipartFile thumbnail);

  void delete(String id);

  public List<ArtResponse> getFeaturedArts();
}
