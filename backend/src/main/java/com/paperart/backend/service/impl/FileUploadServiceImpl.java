package com.paperart.backend.service.impl;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.paperart.backend.dto.response.UploadFileResponse;
import com.paperart.backend.dto.response.UploadPageResponse;
import com.paperart.backend.dto.response.UploadResponse;
import com.paperart.backend.service.FileUploadService;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
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

        	String originalName = file.getOriginalFilename();

        	int dotIndex = originalName.lastIndexOf('.');
        	String extension = "";
        	String fileName = originalName;

        	if (dotIndex > -1) {
        	    extension = originalName.substring(dotIndex);
        	    fileName = originalName.substring(0, dotIndex);
        	}

        	String key = folder
        	        + fileName
        	        + "_"
        	        + UUID.randomUUID()
        	        + extension;
        	
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(
                    request,
                    RequestBody.fromBytes(file.getBytes()));

            return new UploadResponse(
                    key,
                    publicUrl + "/" + key
            );

        } catch (Exception e) {
            throw new RuntimeException("檔案上傳失敗", e);
        }
    }

    @Override
    public UploadPageResponse listFiles(
            String folder,
            int page,
            int size,
            String keyword) {

        ListObjectsV2Request request = ListObjectsV2Request.builder()
                .bucket(bucket)
                .prefix(folder + "/")
                .build();

        // 先取得所有圖片
        List<UploadFileResponse> allFiles = s3Client.listObjectsV2(request)
                .contents()
                .stream()
                .map(this::toUploadFileResponse)
                .sorted((a, b) -> b.getLastModified().compareTo(a.getLastModified()))
                .collect(Collectors.toList());

        // 搜尋
        if (keyword != null && !keyword.isBlank()) {
            String search = keyword.toLowerCase();

            allFiles = allFiles.stream()
                    .filter(file ->
                            file.getName().toLowerCase().contains(search))
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
                content,
                page,
                size,
                totalElements,
                totalPages,
                page + 1 < totalPages
        );
    }

    @Override
    public void delete(String key) {

        DeleteObjectRequest request = DeleteObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        s3Client.deleteObject(request);
    }

    /**
     * S3Object -> UploadFileResponse
     */
    /**
     * S3Object -> UploadFileResponse
     */
    private UploadFileResponse toUploadFileResponse(S3Object object) {

        String key = object.key();

        // 取得檔名
        String fileName = key.substring(key.lastIndexOf("/") + 1);

        // 移除 UUID，只保留原始檔名
        fileName = fileName.replaceFirst(
                "_[0-9a-fA-F\\-]{36}(?=\\.)",
                ""
        );

        return new UploadFileResponse(
                key,
                fileName,
                publicUrl + "/" + key,
                object.size(),
                object.lastModified()
        );
    }	
}