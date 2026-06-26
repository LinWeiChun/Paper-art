package com.paperart.backend.dto.response;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UploadFileResponse {

  private String key;

  private String name;

  private String url;

  private Long size;

  private Instant lastModified;
}
