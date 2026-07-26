package com.paperart.backend.exception;

import com.paperart.backend.security.RequestTraceFilter;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ApiException.class)
  public ResponseEntity<ApiError> handleApiException(
      ApiException exception, HttpServletRequest request) {
    return build(exception.getStatus(), exception.getCode(), exception.getMessage(), request, null);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiError> handleValidationException(
      MethodArgumentNotValidException exception, HttpServletRequest request) {
    Map<String, String> details = new LinkedHashMap<>();

    for (FieldError fieldError : exception.getBindingResult().getFieldErrors()) {
      details.putIfAbsent(fieldError.getField(), fieldError.getDefaultMessage());
    }

    return build(HttpStatus.BAD_REQUEST, "VALIDATION_FAILED", "輸入資料驗證失敗", request, details);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ApiError> handleIllegalArgumentException(
      IllegalArgumentException exception, HttpServletRequest request) {
    return build(HttpStatus.BAD_REQUEST, "INVALID_REQUEST", exception.getMessage(), request, null);
  }

  @ExceptionHandler(MaxUploadSizeExceededException.class)
  public ResponseEntity<ApiError> handleMaxUploadSize(
      MaxUploadSizeExceededException exception, HttpServletRequest request) {
    return build(HttpStatus.PAYLOAD_TOO_LARGE, "FILE_TOO_LARGE", "上傳檔案超過容量限制", request, null);
  }

  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<ApiError> handleConflict(
      DataIntegrityViolationException exception, HttpServletRequest request) {
    log.warn("資料衝突，traceId={}", MDC.get(RequestTraceFilter.TRACE_ID_KEY), exception);
    return build(HttpStatus.CONFLICT, "DATA_CONFLICT", "資料已存在或與現有資料衝突", request, null);
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ApiError> handleAccessDenied(
      AccessDeniedException exception, HttpServletRequest request) {
    return build(HttpStatus.FORBIDDEN, "FORBIDDEN", "沒有執行此操作的權限", request, null);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiError> handleException(Exception exception, HttpServletRequest request) {
    log.error("系統錯誤，traceId={}", MDC.get(RequestTraceFilter.TRACE_ID_KEY), exception);
    return build(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", "系統暫時無法處理請求", request, null);
  }

  private ResponseEntity<ApiError> build(
      HttpStatus status,
      String code,
      String message,
      HttpServletRequest request,
      Map<String, String> details) {
    ApiError error =
        ApiError.builder()
            .timestamp(Instant.now())
            .status(status.value())
            .code(code)
            .message(message)
            .path(request.getRequestURI())
            .traceId(MDC.get(RequestTraceFilter.TRACE_ID_KEY))
            .details(details)
            .build();

    return ResponseEntity.status(status).body(error);
  }
}
