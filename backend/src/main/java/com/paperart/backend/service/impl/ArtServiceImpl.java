package com.paperart.backend.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.paperart.backend.dto.request.ArtRequest;
import com.paperart.backend.dto.response.ArtResponse;
import com.paperart.backend.dto.response.OptionResponse;
import com.paperart.backend.entity.Art;
import com.paperart.backend.entity.Author;
import com.paperart.backend.entity.Category;
import com.paperart.backend.entity.Tag;
import com.paperart.backend.repository.ArtRepository;
import com.paperart.backend.repository.AuthorRepository;
import com.paperart.backend.repository.CategoryRepository;
import com.paperart.backend.repository.TagRepository;
import com.paperart.backend.service.ArtService;
import com.paperart.backend.service.FileUploadService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ArtServiceImpl implements ArtService {

    private final ArtRepository artRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final FileUploadService fileUploadService;

    /**
     * 前台全部作品
     */
    @Override
    public List<ArtResponse> getAll() {

        return artRepository.findAll(
                Sort.by("sortOrder").ascending()
        ).stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * 後台分頁
     */
    @Override
    public Page<ArtResponse> getAll(int page, int size) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("sortOrder").ascending()
        );

        return artRepository.findAll(pageable)
                .map(this::toResponse);
    }

    /**
     * 單筆查詢
     */
    @Override
    public ArtResponse getById(String id) {

        Art art = artRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Art not found"));

        return toResponse(art);
    }

    /**
     * 新增作品
     */
    @Override
    public ArtResponse create(
            ArtRequest request,
            MultipartFile thumbnail) {

        Art art = new Art();

        art.setTitle(request.getTitle());
        art.setDescription(request.getDescription());
        art.setYear(request.getYear());
        art.setSortOrder(request.getSortOrder());
        art.setFeatured(request.getFeatured());
        art.setRentable(request.getRentable());

        // 作者
        List<Author> authors =
                authorRepository.findAllById(request.getAuthorIds());

        art.setAuthors(
        	    request.getAuthorIds() == null
        	        ? new ArrayList<>()
        	        : authorRepository.findAllById(request.getAuthorIds())
        );

        // 分類
        List<Category> categories =
                categoryRepository.findAllById(request.getCategoryIds());


        art.setCategories(
        	    request.getCategoryIds() == null
        	        ? new ArrayList<>()
        	        : categoryRepository.findAllById(request.getCategoryIds())
        );

        // 標籤
        List<Tag> tags =
                tagRepository.findAllById(request.getTagIds());


        art.setTags(
        	    request.getTagIds() == null
        	        ? new ArrayList<>()
        	        : tagRepository.findAllById(request.getTagIds())
        );

        // 上傳縮圖
        if (thumbnail != null && !thumbnail.isEmpty()) {

            String imageUrl =
                    fileUploadService.upload(thumbnail, "arts/");

            art.setThumbnail(imageUrl);
        }

        artRepository.save(art);

        return toResponse(art);
    }

    /**
     * 修改作品
     */
    @Override
    public ArtResponse update(
            String id,
            ArtRequest request,
            MultipartFile thumbnail) {

        Art art = artRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Art not found"));

        art.setTitle(request.getTitle());
        art.setDescription(request.getDescription());
        art.setYear(request.getYear());
        art.setSortOrder(request.getSortOrder());
        art.setFeatured(request.getFeatured());
        art.setRentable(request.getRentable());

        // 作者
        art.setAuthors(
                authorRepository.findAllById(request.getAuthorIds()));

        // 分類
        art.setCategories(
                categoryRepository.findAllById(request.getCategoryIds()));

        // 標籤
        art.setTags(
                tagRepository.findAllById(request.getTagIds()));

        // 更新圖片
        if (thumbnail != null && !thumbnail.isEmpty()) {

            String imageUrl =
                    fileUploadService.upload(thumbnail, "arts/");

            art.setThumbnail(imageUrl);
        }

        artRepository.save(art);

        return toResponse(art);
    }

    /**
     * 刪除
     */
    @Override
    public void delete(String id) {

        artRepository.deleteById(id);
    }

    @Override
    public List<ArtResponse> getFeaturedArts() {
        return artRepository
                .findByFeaturedTrueOrderBySortOrderAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }
    
    /**
     * Entity → Response
     */
    private ArtResponse toResponse(Art art) {

        return ArtResponse.builder()
                .id(art.getId())
                .title(art.getTitle())
                .description(art.getDescription())
                .thumbnail(art.getThumbnail())
                .year(art.getYear())
                .sortOrder(art.getSortOrder())
                .featured(art.getFeatured())
                .rentable(art.getRentable())

                .authors(
                        art.getAuthors()
                                .stream()
                                .map(author -> new OptionResponse(
                                        author.getId(),
                                        author.getName()))
                                .toList())

                .categories(
                        art.getCategories()
                                .stream()
                                .map(category -> new OptionResponse(
                                        category.getId(),
                                        category.getName()))
                                .toList())

                .tags(
                        art.getTags()
                                .stream()
                                .map(tag -> new OptionResponse(
                                        tag.getId(),
                                        tag.getName()))
                                .toList())

                .build();
    }
}