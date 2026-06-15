	package com.paperart.backend.controller;
	
	import org.springframework.data.domain.Page;
	import org.springframework.web.bind.annotation.*;
	import org.springframework.web.multipart.MultipartFile;
	
	import com.paperart.backend.dto.request.NewsRequest;
	import com.paperart.backend.dto.response.NewsResponse;
	import com.paperart.backend.service.NewsService;
	
	import lombok.RequiredArgsConstructor;
	
	@RestController
	@RequestMapping("/news")
	@RequiredArgsConstructor
	public class NewsController {
	
	    private final NewsService newsService;
	
	    // 查全部
	    @GetMapping
	    public Page<NewsResponse> getAllNews(
	            @RequestParam(defaultValue = "0") int page,
	            @RequestParam(defaultValue = "6") int size) {
	
	        return newsService.getAllNews(page, size);
	    }
	
	    // 查單筆
	    @GetMapping("/{id}")
	    public NewsResponse getNewsById(@PathVariable String id) {
	
	        return newsService.getNewsById(id);
	    }
	
	    // 新增
	    @PostMapping
	    public NewsResponse createNews(
	            @RequestPart("news") NewsRequest request,
	            @RequestPart(value = "image", required = false)
	            MultipartFile image) {
	
	        return newsService.createNews(request, image);
	    }
	
	    // 修改
	    @PutMapping("/{id}")
	    public NewsResponse updateNews(
	            @PathVariable String id,
	            @RequestPart("news") NewsRequest request,
	            @RequestPart(value = "image", required = false)
	            MultipartFile image) {
	
	        return newsService.updateNews(id, request, image);
	    }
	
	    // 刪除
	    @DeleteMapping("/{id}")
	    public void deleteNews(@PathVariable String id) {
	
	        newsService.deleteNews(id);
	    }
	}