package com.paperart.backend.repository;

import com.paperart.backend.entity.AutomationExecutionLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AutomationExecutionLogRepository
    extends JpaRepository<AutomationExecutionLog, String> {}
