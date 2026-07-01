package com.paperart.backend.service.impl;

import com.paperart.backend.dto.response.UploadFileResponse;
import com.paperart.backend.dto.response.UploadPageResponse;
import com.paperart.backend.dto.response.UploadResponse;
import com.paperart.backend.service.FileUploadService;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CopyObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Object;

@Service
@RequiredArgsConstructor
public class FileUploadServiceImpl implements FileUploadService {

  private final S3Client s3Client;

  @Value("${cloudflare.r2.bucket}")
  private String bucket;

  @Value("${cloudflare.r2.public-url}")
  private String publicUrl;

  @Override
  public UploadResponse upload(MultipartFile file, String folder) {

    try {

      String key = folder + buildStoredFileName(file.getOriginalFilename());

      PutObjectRequest request =
          PutObjectRequest.builder()
              .bucket(bucket)
              .key(key)
              .contentType(file.getContentType())
              .build();

      s3Client.putObject(request, RequestBody.fromBytes(file.getBytes()));

      return new UploadResponse(key, publicUrl + "/" + key);

    } catch (Exception e) {
      throw new RuntimeException("檔案上傳失敗", e);
    }
  }

  @Override
  public UploadPageResponse listFiles(String folder, int page, int size, String keyword) {

    ListObjectsV2Request request =
        ListObjectsV2Request.builder().bucket(bucket).prefix(folder + "/").build();

    // 先取得所有圖片
    List<UploadFileResponse> allFiles =
        s3Client.listObjectsV2(request).contents().stream()
            .map(this::toUploadFileResponse)
            .sorted((a, b) -> b.getLastModified().compareTo(a.getLastModified()))
            .collect(Collectors.toList());

    // 搜尋
    if (keyword != null && !keyword.isBlank()) {
      String search = keyword.toLowerCase();

      allFiles =
          allFiles.stream()
              .filter(file -> file.getName().toLowerCase().contains(search))
              .collect(Collectors.toList());
    }

    // 分頁
    int totalElements = allFiles.size();
    int totalPages = (int) Math.ceil((double) totalElements / size);

    int fromIndex = page * size;
    int toIndex = Math.min(fromIndex + size, totalElements);

    List<UploadFileResponse> content;

    if (fromIndex >= totalElements) {
      content = List.of();
    } else {
      content = allFiles.subList(fromIndex, toIndex);
    }

    return new UploadPageResponse(
        content, page, size, totalElements, totalPages, page + 1 < totalPages);
  }

  @Override
  public void delete(String key) {

    DeleteObjectRequest request = DeleteObjectRequest.builder().bucket(bucket).key(key).build();

    s3Client.deleteObject(request);
  }

  @Override
  public void moveToDeleteFolder(String fileUrlOrKey) {
    String sourceKey = extractKey(fileUrlOrKey);

    if (sourceKey == null || sourceKey.isBlank() || sourceKey.startsWith("delete/")) {
      return;
    }

    String destinationKey = "delete/" + sourceKey;

    CopyObjectRequest copyRequest =
        CopyObjectRequest.builder()
            .copySource(buildCopySource(sourceKey))
            .bucket(bucket)
            .key(destinationKey)
            .build();

    s3Client.copyObject(copyRequest);
    delete(sourceKey);
  }

  /** S3Object -> UploadFileResponse */
  private UploadFileResponse toUploadFileResponse(S3Object object) {

    String key = object.key();

    // 取得檔名
    String fileName = key.substring(key.lastIndexOf("/") + 1);

    // 移除 UUID，只保留原始檔名
    fileName = removeUuidSuffix(fileName);

    return new UploadFileResponse(
        key, fileName, publicUrl + "/" + key, object.size(), object.lastModified());
  }

  private String buildStoredFileName(String originalName) {
    String fileName = originalName;

    if (fileName == null || fileName.isBlank()) {
      fileName = "file";
    }

    fileName = fileName.replace("\\", "/");
    fileName = fileName.substring(fileName.lastIndexOf("/") + 1);

    int dotIndex = fileName.lastIndexOf('.');

    if (dotIndex > -1) {
      return fileName.substring(0, dotIndex)
          + "_"
          + UUID.randomUUID()
          + fileName.substring(dotIndex);
    }

    return fileName + "_" + UUID.randomUUID();
  }

  private String removeUuidSuffix(String fileName) {
    return fileName
        .replaceFirst("_[0-9a-fA-F\\-]{36}$", "")
        .replaceFirst("_[0-9a-fA-F\\-]{36}(?=\\.)", "");
  }

  private String extractKey(String fileUrlOrKey) {
    if (fileUrlOrKey == null || fileUrlOrKey.isBlank()) {
      return null;
    }

    if (fileUrlOrKey.startsWith(publicUrl + "/")) {
      return fileUrlOrKey.substring((publicUrl + "/").length());
    }

    if (fileUrlOrKey.startsWith("http://") || fileUrlOrKey.startsWith("https://")) {
      return null;
    }

    return fileUrlOrKey;
  }

  private String buildCopySource(String sourceKey) {
    String encodedSourceKey =
        URLEncoder.encode(sourceKey, StandardCharsets.UTF_8)
            .replace("+", "%20")
            .replace("%2F", "/");

    return bucket + "/" + encodedSourceKey;
  }
}
