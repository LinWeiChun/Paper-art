package com.paperart.backend.config;

import com.paperart.backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.util.matcher.RegexRequestMatcher;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final JwtAuthenticationFilter jwtAuthenticationFilter;

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

    http.cors(Customizer.withDefaults())
        .csrf(AbstractHttpConfigurer::disable)
        .formLogin(AbstractHttpConfigurer::disable)
        .httpBasic(AbstractHttpConfigurer::disable)
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(
            auth ->
                auth.requestMatchers(HttpMethod.OPTIONS, "/**")
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/contact")
                    .permitAll()
                    .requestMatchers(HttpMethod.POST, "/contact-messages")
                    .permitAll()
                    .requestMatchers("/auth/**")
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/about")
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/arts", "/arts/featured")
                    .permitAll()
                    .requestMatchers(
                        RegexRequestMatcher.regexMatcher(
                            HttpMethod.GET, "^/arts/[0-9a-fA-F-]{36}$"))
                    .permitAll()
                    .requestMatchers(HttpMethod.POST, "/arts/search")
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/news")
                    .permitAll()
                    .requestMatchers(
                        RegexRequestMatcher.regexMatcher(
                            HttpMethod.GET, "^/news/[0-9a-fA-F-]{36}$"))
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/authors")
                    .permitAll()
                    .requestMatchers(
                        RegexRequestMatcher.regexMatcher(
                            HttpMethod.GET, "^/authors/[0-9a-fA-F-]{36}$"))
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/categories")
                    .permitAll()
                    .requestMatchers(
                        RegexRequestMatcher.regexMatcher(
                            HttpMethod.GET, "^/categories/[0-9a-fA-F-]{36}$"))
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/banners")
                    .permitAll()
                    .requestMatchers(
                        RegexRequestMatcher.regexMatcher(
                            HttpMethod.GET, "^/banners/[0-9a-fA-F-]{36}$"))
                    .permitAll()
                    .anyRequest()
                    .authenticated())
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }
}
