package com.paperart.backend.config;

import com.paperart.backend.security.JwtAuthenticationFilter;
import com.paperart.backend.security.RequestTraceFilter;
import com.paperart.backend.security.RestSecurityErrorWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.csrf.InvalidCsrfTokenException;
import org.springframework.security.web.csrf.MissingCsrfTokenException;
import org.springframework.security.web.util.matcher.RegexRequestMatcher;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final JwtAuthenticationFilter jwtAuthenticationFilter;
  private final RequestTraceFilter requestTraceFilter;
  private final RestSecurityErrorWriter securityErrorWriter;

  @Value("${csrf.cookie-secure:true}")
  private boolean csrfCookieSecure;

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    CookieCsrfTokenRepository csrfRepository = CookieCsrfTokenRepository.withHttpOnlyFalse();
    csrfRepository.setCookiePath("/");
    csrfRepository.setCookieCustomizer(cookie -> cookie.secure(csrfCookieSecure).sameSite("Lax"));

    CsrfTokenRequestAttributeHandler csrfRequestHandler = new CsrfTokenRequestAttributeHandler();
    csrfRequestHandler.setCsrfRequestAttributeName(null);

    http.cors(Customizer.withDefaults())
        .csrf(
            csrf ->
                csrf.csrfTokenRepository(csrfRepository)
                    .csrfTokenRequestHandler(csrfRequestHandler))
        .formLogin(AbstractHttpConfigurer::disable)
        .httpBasic(AbstractHttpConfigurer::disable)
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .exceptionHandling(
            exceptions ->
                exceptions
                    .authenticationEntryPoint(
                        (request, response, exception) ->
                            securityErrorWriter.write(
                                request,
                                response,
                                HttpStatus.UNAUTHORIZED,
                                "UNAUTHORIZED",
                                "尚未登入或登入已逾期"))
                    .accessDeniedHandler(
                        (request, response, exception) -> {
                          boolean csrfFailure =
                              exception instanceof MissingCsrfTokenException
                                  || exception instanceof InvalidCsrfTokenException;
                          securityErrorWriter.write(
                              request,
                              response,
                              HttpStatus.FORBIDDEN,
                              csrfFailure ? "CSRF_INVALID" : "FORBIDDEN",
                              csrfFailure ? "安全驗證已逾期，請重新操作" : "沒有執行此操作的權限");
                        }))
        .authorizeHttpRequests(
            auth ->
                auth.requestMatchers(HttpMethod.OPTIONS, "/**")
                    .permitAll()
                    .requestMatchers("/auth/**")
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/actuator/health")
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/contact")
                    .permitAll()
                    .requestMatchers(HttpMethod.POST, "/contact-messages")
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
                    .requestMatchers(HttpMethod.GET, "/authors", "/authors/page")
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
                    .requestMatchers("/admin/r2/**", "/users/**", "/roles/**")
                    .hasAuthority("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/about")
                    .hasAnyAuthority("ADMIN", "ABOUT_MANAGE")
                    .requestMatchers("/banners/admin/**")
                    .hasAnyAuthority("ADMIN", "BANNER_MANAGE")
                    .requestMatchers(HttpMethod.POST, "/banners/**")
                    .hasAnyAuthority("ADMIN", "BANNER_MANAGE")
                    .requestMatchers(HttpMethod.PUT, "/banners/**")
                    .hasAnyAuthority("ADMIN", "BANNER_MANAGE")
                    .requestMatchers(HttpMethod.DELETE, "/banners/**")
                    .hasAnyAuthority("ADMIN", "BANNER_MANAGE")
                    .requestMatchers("/news/admin/**")
                    .hasAnyAuthority("ADMIN", "NEWS_MANAGE")
                    .requestMatchers(HttpMethod.POST, "/news/**")
                    .hasAnyAuthority("ADMIN", "NEWS_MANAGE")
                    .requestMatchers(HttpMethod.PUT, "/news/**")
                    .hasAnyAuthority("ADMIN", "NEWS_MANAGE")
                    .requestMatchers(HttpMethod.DELETE, "/news/**")
                    .hasAnyAuthority("ADMIN", "NEWS_MANAGE")
                    .requestMatchers("/authors/admin/**")
                    .hasAnyAuthority("ADMIN", "AUTHOR_MANAGE")
                    .requestMatchers(HttpMethod.POST, "/authors/**")
                    .hasAnyAuthority("ADMIN", "AUTHOR_MANAGE")
                    .requestMatchers(HttpMethod.PUT, "/authors/**")
                    .hasAnyAuthority("ADMIN", "AUTHOR_MANAGE")
                    .requestMatchers(HttpMethod.DELETE, "/authors/**")
                    .hasAnyAuthority("ADMIN", "AUTHOR_MANAGE")
                    .requestMatchers("/categories/admin/**")
                    .hasAnyAuthority("ADMIN", "CATEGORY_MANAGE")
                    .requestMatchers(HttpMethod.POST, "/categories/**")
                    .hasAnyAuthority("ADMIN", "CATEGORY_MANAGE")
                    .requestMatchers(HttpMethod.PUT, "/categories/**")
                    .hasAnyAuthority("ADMIN", "CATEGORY_MANAGE")
                    .requestMatchers(HttpMethod.DELETE, "/categories/**")
                    .hasAnyAuthority("ADMIN", "CATEGORY_MANAGE")
                    .requestMatchers("/arts/admin/**")
                    .hasAnyAuthority("ADMIN", "ART_MANAGE")
                    .requestMatchers(HttpMethod.POST, "/arts/**")
                    .hasAnyAuthority("ADMIN", "ART_MANAGE")
                    .requestMatchers(HttpMethod.PUT, "/arts/**")
                    .hasAnyAuthority("ADMIN", "ART_MANAGE")
                    .requestMatchers(HttpMethod.DELETE, "/arts/**")
                    .hasAnyAuthority("ADMIN", "ART_MANAGE")
                    .requestMatchers(HttpMethod.PUT, "/contact")
                    .hasAnyAuthority("ADMIN", "CONTACT_MANAGE")
                    .requestMatchers(HttpMethod.GET, "/contact-messages/**")
                    .hasAnyAuthority("ADMIN", "CONTACT_MESSAGE_MANAGE")
                    .requestMatchers(HttpMethod.PUT, "/contact-messages/**")
                    .hasAnyAuthority("ADMIN", "CONTACT_MESSAGE_MANAGE")
                    .requestMatchers("/upload/**")
                    .hasAnyAuthority(
                        "ADMIN",
                        "BANNER_MANAGE",
                        "ABOUT_MANAGE",
                        "NEWS_MANAGE",
                        "AUTHOR_MANAGE",
                        "ART_MANAGE")
                    .anyRequest()
                    .authenticated())
        .addFilterBefore(requestTraceFilter, UsernamePasswordAuthenticationFilter.class)
        .addFilterAfter(jwtAuthenticationFilter, RequestTraceFilter.class);
    return http.build();
  }
}
