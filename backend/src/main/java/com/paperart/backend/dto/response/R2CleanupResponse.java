package com.paperart.backend.dto.response;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class R2CleanupResponse {

  private int scannedCount;

  private int usedCount;

  private int movedCount;

  private int skippedCount;

  private boolean dryRun;

  private List<String> movedKeys;

  private List<String> skippedKeys;
}
