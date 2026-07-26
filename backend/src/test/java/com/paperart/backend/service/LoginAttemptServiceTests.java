package com.paperart.backend.service;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.paperart.backend.exception.ApiException;
import org.junit.jupiter.api.Test;

class LoginAttemptServiceTests {

  @Test
  void blocksAfterFiveFailures() {
    LoginAttemptService service = new LoginAttemptService();
    String key = "admin|127.0.0.1";

    for (int i = 0; i < 5; i++) {
      service.recordFailure(key);
    }

    assertThatThrownBy(() -> service.checkAllowed(key))
        .isInstanceOf(ApiException.class)
        .extracting("code")
        .isEqualTo("LOGIN_RATE_LIMITED");
  }

  @Test
  void successfulLoginClearsFailures() {
    LoginAttemptService service = new LoginAttemptService();
    String key = "admin|127.0.0.1";

    for (int i = 0; i < 5; i++) {
      service.recordFailure(key);
    }
    service.recordSuccess(key);

    assertThatCode(() -> service.checkAllowed(key)).doesNotThrowAnyException();
  }
}
