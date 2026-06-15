	package com.paperart.backend.controller;
	
	import org.springframework.web.bind.annotation.GetMapping;
	import org.springframework.web.bind.annotation.PutMapping;
	import org.springframework.web.bind.annotation.RequestBody;
	import org.springframework.web.bind.annotation.RequestMapping;
	import org.springframework.web.bind.annotation.RestController;
	
	import com.paperart.backend.dto.request.AboutRequest;
	import com.paperart.backend.dto.response.AboutResponse;
	import com.paperart.backend.service.AboutService;
	
	import lombok.RequiredArgsConstructor;
	
	@RestController
	@RequestMapping("/about")
	@RequiredArgsConstructor
	public class AboutController {
	
	    private final AboutService aboutService;
	
	    @GetMapping
	    public AboutResponse getAbout() {
	        return aboutService.getAbout();
	    }
	
	    @PutMapping
	    public AboutResponse updateAbout(
	            @RequestBody AboutRequest request) {
	
	        return aboutService.updateAbout(request);
	    }
	}
