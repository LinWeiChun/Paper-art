package com.paperart.backend.dto.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UploadPageResponse {

  private List<UploadFileResponse> content;

  private int page;

  private int size;

  private long totalElements;

  private int totalPages;

  private boolean hasNext;
}
