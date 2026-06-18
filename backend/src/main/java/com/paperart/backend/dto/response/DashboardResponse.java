package com.paperart.backend.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class DashboardResponse {

    private long artCount;
    private long authorCount;
    private long newsCount;

    private List<OptionResponse> recentArts;
    private List<OptionResponse> recentNews;
}
