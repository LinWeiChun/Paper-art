package com.paperart.backend.dto.request;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArtSearchRequest {

  /** 關鍵字（作品名稱、描述） */
  private String keyword;

  /** 作者（可多選） */
  private List<String> authorIds;

  /** 分類（可多選） */
  private List<String> categoryIds;

  /** 標籤（可多選） */
  private List<String> tagIds;

  /** 是否可租借 */
  private Boolean rentable;

  /** 是否精選 */
  private Boolean featured;

  /** 排序方式 newest oldest sortOrder title */
  private String sort;
}
