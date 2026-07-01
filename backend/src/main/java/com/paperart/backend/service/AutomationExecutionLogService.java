package com.paperart.backend.service;

import com.paperart.backend.entity.AutomationExecutionLog;

public interface AutomationExecutionLogService {

  AutomationExecutionLog start(
      String jobKey,
      String jobName,
      String jobType,
      String triggerType,
      Object requestPayload,
      Object metadata);

  AutomationExecutionLog markSuccess(AutomationExecutionLog log, Object resultPayload);

  AutomationExecutionLog markFailed(AutomationExecutionLog log, Exception exception);
}
