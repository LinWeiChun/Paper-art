package com.paperart.backend.service;

import com.paperart.backend.dto.request.AboutRequest;
import com.paperart.backend.dto.response.AboutResponse;

public interface AboutService {

  AboutResponse getAbout();

  AboutResponse updateAbout(AboutRequest request);
}
