package com.paperart.backend.controller;

import com.paperart.backend.dto.response.R2CleanupResponse;
import com.paperart.backend.service.R2CleanupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/r2")
@RequiredArgsConstructor
public class R2CleanupController {

  private final R2CleanupService r2CleanupService;

  @PostMapping("/cleanup-unused-files")
  public ResponseEntity<R2CleanupResponse> cleanupUnusedFiles(
      @RequestParam(defaultValue = "false") boolean dryRun) {

    return ResponseEntity.ok(r2CleanupService.moveUnusedFilesToDeleteFolder(dryRun));
  }
}
