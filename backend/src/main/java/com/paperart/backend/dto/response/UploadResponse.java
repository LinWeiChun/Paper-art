package com.paperart.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UploadResponse {

  /** R2 Object Key ex: ckeditor/6fa7d8b0_test.jpg */
  private String key;

  /** 公開網址 */
  private String url;
}
