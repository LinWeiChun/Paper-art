package com.paperart.backend.exception;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.paperart.backend.controller.ArtController;
import com.paperart.backend.security.RequestTraceFilter;
import com.paperart.backend.service.ArtService;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class GlobalExceptionHandlerTests {

  @Test
  void unexpectedFailureRemains500WithoutExposingInternalDetails() throws Exception {
    ArtService artService = mock(ArtService.class);
    when(artService.search(any(), anyInt(), anyInt()))
        .thenThrow(new IllegalStateException("SELECT private_column FROM private_table"));
    var mockMvc =
        MockMvcBuilders.standaloneSetup(new ArtController(artService))
            .setControllerAdvice(new GlobalExceptionHandler())
            .addFilters(new RequestTraceFilter())
            .build();

    var result =
        mockMvc
            .perform(post("/arts/search").contentType(MediaType.APPLICATION_JSON).content("{}"))
            .andExpect(status().isInternalServerError())
            .andExpect(jsonPath("$.status").value(500))
            .andExpect(jsonPath("$.code").value("INTERNAL_ERROR"))
            .andExpect(jsonPath("$.message").value("系統暫時無法處理請求"))
            .andExpect(jsonPath("$.path").value("/arts/search"))
            .andExpect(jsonPath("$.timestamp").isNotEmpty())
            .andExpect(jsonPath("$.traceId").isNotEmpty())
            .andExpect(jsonPath("$.details").doesNotExist())
            .andReturn();
    jsonPath("$.traceId").value(result.getResponse().getHeader("X-Trace-Id")).match(result);
    assertThat(result.getResponse().getContentAsString())
        .doesNotContain(
            "SELECT", "private_column", "private_table", "IllegalStateException", "stackTrace");
  }
}
