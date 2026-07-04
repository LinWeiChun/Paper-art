package com.paperart.backend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.paperart.backend.dto.request.ArtRequest;
import com.paperart.backend.dto.request.ArtSearchRequest;
import com.paperart.backend.dto.response.ArtResponse;
import com.paperart.backend.dto.response.ImportResponse;
import com.paperart.backend.service.ArtService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/arts")
@RequiredArgsConstructor
public class ArtController {

	private final ArtService artService;

	// 後台
	@GetMapping
	public ResponseEntity<Page<ArtResponse>> getAll(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "12") int size) {

		return ResponseEntity.ok(artService.getAll(page, size));
	}

	@GetMapping("/admin")
	public ResponseEntity<Page<ArtResponse>> getAdminAll(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "12") int size) {

		return ResponseEntity.ok(artService.getAdminAll(page, size));
	}

	@GetMapping("/{id}")
	public ArtResponse getById(@PathVariable String id) {
		return artService.getById(id);
	}

	@GetMapping("/admin/{id}")
	public ArtResponse getAdminById(@PathVariable String id) {
		return artService.getAdminById(id);
	}

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ArtResponse create(@RequestPart("data") ArtRequest request,
			@RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail) {

		return artService.create(request, thumbnail);
	}

	@PostMapping(value = "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ImportResponse> importArts(@RequestPart("file") MultipartFile file) {

		return ResponseEntity.ok(artService.importArts(file));
	}

	@PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ArtResponse update(@PathVariable String id, @RequestPart("data") ArtRequest request,
			@RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail) {

		return artService.update(id, request, thumbnail);
	}

	@DeleteMapping("/{id}")
	public void delete(@PathVariable String id) {
		artService.delete(id);
	}

	@GetMapping("/featured")
	public ResponseEntity<List<ArtResponse>> getFeaturedArts() {
		return ResponseEntity.ok(artService.getFeaturedArts());
	}

	@PostMapping("/search")
	public ResponseEntity<Page<ArtResponse>> search(@RequestBody ArtSearchRequest request,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "12") int size) {

		return ResponseEntity.ok(artService.search(request, page, size));
	}
}
