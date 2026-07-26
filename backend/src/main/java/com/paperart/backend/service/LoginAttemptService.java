package com.paperart.backend.service;

import com.paperart.backend.exception.ApiException;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class LoginAttemptService {

  private static final int MAX_ATTEMPTS = 5;
  private static final Duration ATTEMPT_WINDOW = Duration.ofMinutes(15);
  private static final Duration BLOCK_DURATION = Duration.ofMinutes(15);

  private final ConcurrentHashMap<String, AttemptState> attempts = new ConcurrentHashMap<>();
  private final Clock clock;

  public LoginAttemptService() {
    this(Clock.systemUTC());
  }

  LoginAttemptService(Clock clock) {
    this.clock = clock;
  }

  public void checkAllowed(String key) {
    AttemptState state = attempts.get(key);
    Instant now = clock.instant();

    if (state == null) {
      return;
    }

    if (state.blockedUntil() != null && state.blockedUntil().isAfter(now)) {
      throw new ApiException(
          HttpStatus.TOO_MANY_REQUESTS, "LOGIN_RATE_LIMITED", "登入失敗次數過多，請 15 分鐘後再試");
    }

    if (state.firstAttempt().plus(ATTEMPT_WINDOW).isBefore(now)) {
      attempts.remove(key, state);
    }
  }

  public void recordFailure(String key) {
    Instant now = clock.instant();

    attempts.compute(
        key,
        (ignored, current) -> {
          int count = 1;
          Instant firstAttempt = now;

          if (current != null && current.firstAttempt().plus(ATTEMPT_WINDOW).isAfter(now)) {
            count = current.count() + 1;
            firstAttempt = current.firstAttempt();
          }

          Instant blockedUntil = count >= MAX_ATTEMPTS ? now.plus(BLOCK_DURATION) : null;
          return new AttemptState(count, firstAttempt, blockedUntil);
        });
  }

  public void recordSuccess(String key) {
    attempts.remove(key);
  }

  private record AttemptState(int count, Instant firstAttempt, Instant blockedUntil) {}
}
