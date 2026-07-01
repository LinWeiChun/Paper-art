package com.paperart.backend.service;

import com.paperart.backend.dto.response.R2CleanupResponse;

public interface R2CleanupService {

  R2CleanupResponse moveUnusedFilesToDeleteFolder(boolean dryRun);

  R2CleanupResponse moveUnusedFilesToDeleteFolder(boolean dryRun, String triggerType);
}
