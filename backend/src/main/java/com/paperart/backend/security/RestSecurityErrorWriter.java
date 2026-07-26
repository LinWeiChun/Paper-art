package com.paperart.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.paperart.backend.exception.ApiError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RestSecurityErrorWriter {

  private final ObjectMapper objectMapper;

  public void write(
      HttpServletRequest request,
      HttpServletResponse response,
      HttpStatus status,
      String code,
      String message)
      throws IOException {

    response.setStatus(status.value());
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.setCharacterEncoding("UTF-8");

    ApiError error =
        ApiError.builder()
            .timestamp(Instant.now())
            .status(status.value())
            .code(code)
            .message(message)
            .path(request.getRequestURI())
            .traceId(MDC.get(RequestTraceFilter.TRACE_ID_KEY))
            .build();

    objectMapper.writeValue(response.getOutputStream(), error);
  }
}
