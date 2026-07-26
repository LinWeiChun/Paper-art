package com.paperart.backend.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.Map;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class ApiError {

  private final Instant timestamp;
  private final int status;
  private final String code;
  private final String message;
  private final String path;
  private final String traceId;
  private final Map<String, String> details;
}
