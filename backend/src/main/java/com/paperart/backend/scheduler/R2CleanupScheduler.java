package com.paperart.backend.scheduler;

import com.paperart.backend.service.R2CleanupService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class R2CleanupScheduler {

  private final R2CleanupService r2CleanupService;

  @Scheduled(cron = "0 0 3 5 * *", zone = "Asia/Taipei")
  public void cleanupUnusedR2FilesMonthly() {
    r2CleanupService.moveUnusedFilesToDeleteFolder(false, "SCHEDULED");
  }
}
