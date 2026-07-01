package com.paperart.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "automation_execution_logs")
@Getter
@Setter
public class AutomationExecutionLog extends BaseEntity {

  @Column(nullable = false, length = 100)
  private String jobKey;

  @Column(nullable = false, length = 150)
  private String jobName;

  @Column(nullable = false, length = 50)
  private String jobType;

  @Column(nullable = false, length = 50)
  private String triggerType;

  @Column(nullable = false, length = 30)
  private String status;

  @Column(nullable = false)
  private LocalDateTime startedAt;

  private LocalDateTime finishedAt;

  private Long durationMs;

  @Column(columnDefinition = "LONGTEXT")
  private String requestPayload;

  @Column(columnDefinition = "LONGTEXT")
  private String resultPayload;

  @Column(columnDefinition = "LONGTEXT")
  private String errorMessage;

  @Column(columnDefinition = "LONGTEXT")
  private String metadata;
}
