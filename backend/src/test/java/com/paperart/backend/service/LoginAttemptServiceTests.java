package com.paperart.backend.service;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.paperart.backend.exception.ApiException;
import java.time.Clock;
import java.time.Instant;
import org.junit.jupiter.api.Test;

class LoginAttemptServiceTests {

  @Test
  void blockExpiresFifteenMinutesAfterTheFifthFailureAndDoesNotBlockOtherKeys() {
    Clock clock = mock(Clock.class);
    Instant start = Instant.parse("2026-10-12T00:00:00Z");
    when(clock.instant()).thenReturn(start);
    LoginAttemptService service = new LoginAttemptService(clock);
    String key = "admin|192.0.2.1";
    for (int i = 0; i < 4; i++) {
      service.recordFailure(key);
      assertThatCode(() -> service.checkAllowed(key)).doesNotThrowAnyException();
    }
    when(clock.instant()).thenReturn(start.plusSeconds(14 * 60));
    service.recordFailure(key);
    when(clock.instant()).thenReturn(start.plusSeconds(29 * 60 - 1));
    assertThatThrownBy(() -> service.checkAllowed(key))
        .isInstanceOf(ApiException.class)
        .extracting("code")
        .isEqualTo("LOGIN_RATE_LIMITED");
    assertThatCode(() -> service.checkAllowed("other|192.0.2.1")).doesNotThrowAnyException();
    assertThatCode(() -> service.checkAllowed("admin|192.0.2.2")).doesNotThrowAnyException();
    when(clock.instant()).thenReturn(start.plusSeconds(29 * 60));
    assertThatCode(() -> service.checkAllowed(key)).doesNotThrowAnyException();
    service.recordFailure(key);
    assertThatCode(() -> service.checkAllowed(key)).doesNotThrowAnyException();
  }

  @Test
  void failuresOutsideTheWindowDoNotAccumulate() {
    Clock clock = mock(Clock.class);
    Instant start = Instant.parse("2026-10-12T00:00:00Z");
    when(clock.instant()).thenReturn(start);
    LoginAttemptService service = new LoginAttemptService(clock);
    String key = "admin|192.0.2.3";
    for (int i = 0; i < 4; i++) {
      service.recordFailure(key);
    }
    when(clock.instant()).thenReturn(start.plusSeconds(15 * 60));
    service.checkAllowed(key);
    service.recordFailure(key);
    assertThatCode(() -> service.checkAllowed(key)).doesNotThrowAnyException();
  }

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
