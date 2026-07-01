package com.paperart.backend.controller;

import com.paperart.backend.dto.response.UploadPageResponse;
import com.paperart.backend.dto.response.UploadResponse;
import com.paperart.backend.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/upload")
@RequiredArgsConstructor
public class UploadController {

  private final FileUploadService fileUploadService;

  /** 上傳圖片 POST /upload/{folder} */
  @PostMapping("/{folder}")
  public ResponseEntity<UploadResponse> upload(
      @PathVariable String folder, @RequestParam("image") MultipartFile image) {

    UploadResponse response = fileUploadService.upload(image, folder + "/");

    return ResponseEntity.ok(response);
  }

  /** 取得圖片列表 GET /upload/{folder} */
  @GetMapping("/{folder}")
  public ResponseEntity<UploadPageResponse> listImages(
      @PathVariable String folder,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size,
      @RequestParam(required = false) String keyword) {

    return ResponseEntity.ok(fileUploadService.listFiles(folder, page, size, keyword));
  }

  /** 將圖片移至 delete 資料夾 DELETE /upload */
  @DeleteMapping
  public ResponseEntity<Void> deleteImage(@RequestParam String key) {

    fileUploadService.moveToDeleteFolder(key);

    return ResponseEntity.noContent().build();
  }
}
