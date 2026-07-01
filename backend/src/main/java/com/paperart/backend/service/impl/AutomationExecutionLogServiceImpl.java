package com.paperart.backend.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.paperart.backend.entity.AutomationExecutionLog;
import com.paperart.backend.repository.AutomationExecutionLogRepository;
import com.paperart.backend.service.AutomationExecutionLogService;
import java.time.Duration;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AutomationExecutionLogServiceImpl implements AutomationExecutionLogService {

  private static final String STATUS_RUNNING = "RUNNING";
  private static final String STATUS_SUCCESS = "SUCCESS";
  private static final String STATUS_FAILED = "FAILED";

  private final AutomationExecutionLogRepository automationExecutionLogRepository;
  private final ObjectMapper objectMapper;

  @Override
  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public AutomationExecutionLog start(
      String jobKey,
      String jobName,
      String jobType,
      String triggerType,
      Object requestPayload,
      Object metadata) {

    AutomationExecutionLog log = new AutomationExecutionLog();
    log.setJobKey(jobKey);
    log.setJobName(jobName);
    log.setJobType(jobType);
    log.setTriggerType(triggerType);
    log.setStatus(STATUS_RUNNING);
    log.setStartedAt(LocalDateTime.now());
    log.setRequestPayload(toJson(requestPayload));
    log.setMetadata(toJson(metadata));

    return automationExecutionLogRepository.save(log);
  }

  @Override
  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public AutomationExecutionLog markSuccess(AutomationExecutionLog log, Object resultPayload) {
    LocalDateTime finishedAt = LocalDateTime.now();

    log.setStatus(STATUS_SUCCESS);
    log.setFinishedAt(finishedAt);
    log.setDurationMs(Duration.between(log.getStartedAt(), finishedAt).toMillis());
    log.setResultPayload(toJson(resultPayload));

    return automationExecutionLogRepository.save(log);
  }

  @Override
  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public AutomationExecutionLog markFailed(AutomationExecutionLog log, Exception exception) {
    LocalDateTime finishedAt = LocalDateTime.now();

    log.setStatus(STATUS_FAILED);
    log.setFinishedAt(finishedAt);
    log.setDurationMs(Duration.between(log.getStartedAt(), finishedAt).toMillis());
    log.setErrorMessage(exception.getMessage());

    return automationExecutionLogRepository.save(log);
  }

  private String toJson(Object value) {
    if (value == null) {
      return null;
    }

    try {
      return objectMapper.writeValueAsString(value);
    } catch (JsonProcessingException e) {
      return String.valueOf(value);
    }
  }
}
