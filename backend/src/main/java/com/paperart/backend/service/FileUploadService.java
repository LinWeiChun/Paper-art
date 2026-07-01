package com.paperart.backend.service;

import com.paperart.backend.dto.response.UploadPageResponse;
import com.paperart.backend.dto.response.UploadResponse;
import org.springframework.web.multipart.MultipartFile;

public interface FileUploadService {

  /** 上傳檔案 */
  UploadResponse upload(MultipartFile file, String folder);

  /** 取得指定資料夾所有檔案 */
  UploadPageResponse listFiles(String folder, int page, int size, String keyword);

  /** 刪除指定檔案 */
  void delete(String key);

  /** 將指定檔案移至 delete 資料夾 */
  void moveToDeleteFolder(String fileUrlOrKey);
}
