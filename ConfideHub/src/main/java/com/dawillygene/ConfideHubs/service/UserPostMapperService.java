package com.dawillygene.ConfideHubs.service;

import com.dawillygene.ConfideHubs.DTO.UserPostRequestDTO;
import com.dawillygene.ConfideHubs.DTO.UserPostResponseDTO;
import com.dawillygene.ConfideHubs.model.Post;
import org.springframework.stereotype.Service;

/**
 * Service for mapping between Post entities and UserPost DTOs
 */
@Service
public class UserPostMapperService {

    /**
     * Convert Post entity to UserPostResponseDTO
     * @param post the post entity
     * @return UserPostResponseDTO
     */
    public UserPostResponseDTO toResponseDTO(Post post) {
        UserPostResponseDTO dto = new UserPostResponseDTO();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setGeneratedTitle(post.getGeneratedTitle());
        dto.setContent(post.getContent());
        dto.setCategories(post.getCategories());
        dto.setHashtags(post.getHashtags());
        dto.setLikes(post.getLikes());
        dto.setSupports(post.getSupports());
        dto.setComments(post.getComments());
        dto.setBookmarked(post.isBookmarked());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setExpiryDuration(post.getExpiryDuration());
        dto.setExpiresAt(post.getExpiresAt());
        dto.setTrendingScore(post.getTrendingScore());
        dto.setDisplayUsername(post.getDisplayUsername());
        dto.setExpired(post.isExpired());
        return dto;
    }

    /**
     * Convert UserPostRequestDTO to Post entity
     * @param dto the request DTO
     * @return Post entity
     */
    public Post toEntity(UserPostRequestDTO dto) {
        Post post = new Post();
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setCategories(dto.getCategories());
        post.setHashtags(dto.getHashtags());
        post.setExpiryDuration(dto.getExpiryDuration());
        return post;
    }

    /**
     * Update existing Post entity with data from UserPostRequestDTO
     * @param existingPost the existing post entity
     * @param dto the request DTO with updated data
     */
    public void updateEntityFromDTO(Post existingPost, UserPostRequestDTO dto) {
        if (dto.getTitle() != null) {
            existingPost.setTitle(dto.getTitle());
        }
        if (dto.getContent() != null) {
            existingPost.setContent(dto.getContent());
        }
        if (dto.getCategories() != null) {
            existingPost.setCategories(dto.getCategories());
        }
        if (dto.getHashtags() != null) {
            existingPost.setHashtags(dto.getHashtags());
        }
        if (dto.getExpiryDuration() != null) {
            existingPost.setExpiryDuration(dto.getExpiryDuration());
        }
    }
}