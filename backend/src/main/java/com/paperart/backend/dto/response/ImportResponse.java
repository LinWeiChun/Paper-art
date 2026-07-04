package com.paperart.backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ImportResponse {

  private int createdCount;

  private int skippedCount;

  private int failedCount;
}
