package com.dawillygene.ConfideHubs.controllers;

import com.dawillygene.ConfideHubs.DTO.UserPostRequestDTO;
import com.dawillygene.ConfideHubs.DTO.UserPostResponseDTO;
import com.dawillygene.ConfideHubs.model.Post;
import com.dawillygene.ConfideHubs.service.UserPostMapperService;
import com.dawillygene.ConfideHubs.service.UserPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST Controller for managing user-specific posts
 * All endpoints require authentication and only allow users to manage their own posts
 */
@RestController
@RequestMapping("/api/user/posts")
@PreAuthorize("isAuthenticated()")
public class UserPostController {

    @Autowired
    private UserPostService userPostService;

    @Autowired
    private UserPostMapperService mapperService;

    /**
     * Get all posts for the current authenticated user
     * 
     * @param page page number (default: 0)
     * @param size number of posts per page (default: 10)
     * @param includeExpired whether to include expired posts (default: false)
     * @return Page of user's posts as DTOs
     */
    @GetMapping
    public ResponseEntity<Page<UserPostResponseDTO>> getCurrentUserPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "false") boolean includeExpired) {
        
        Page<Post> posts = userPostService.getCurrentUserPosts(page, size, includeExpired);
        Page<UserPostResponseDTO> responsePosts = posts.map(mapperService::toResponseDTO);
        return ResponseEntity.ok(responsePosts);
    }

    /**
     * Get a specific post by ID that belongs to the current user
     * 
     * @param postId the post ID
     * @return the post as DTO if found and belongs to user
     */
    @GetMapping("/{postId}")
    public ResponseEntity<UserPostResponseDTO> getCurrentUserPostById(@PathVariable String postId) {
        return userPostService.getCurrentUserPostById(postId)
                .map(mapperService::toResponseDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create a new post for the current user
     * 
     * @param postRequestDTO the post data to create
     * @return the created post as DTO
     */
    @PostMapping
    public ResponseEntity<UserPostResponseDTO> createUserPost(@RequestBody UserPostRequestDTO postRequestDTO) {
        Post post = mapperService.toEntity(postRequestDTO);
        Post createdPost = userPostService.createUserPost(post);
        UserPostResponseDTO responseDTO = mapperService.toResponseDTO(createdPost);
        return ResponseEntity.ok(responseDTO);
    }

    /**
     * Update a post that belongs to the current user
     * 
     * @param postId the post ID to update
     * @param postRequestDTO the updated post data
     * @return the updated post as DTO
     */
    @PutMapping("/{postId}")
    public ResponseEntity<UserPostResponseDTO> updateUserPost(
            @PathVariable String postId, 
            @RequestBody UserPostRequestDTO postRequestDTO) {
        
        try {
            Post updatedPost = mapperService.toEntity(postRequestDTO);
            Post post = userPostService.updateUserPost(postId, updatedPost);
            UserPostResponseDTO responseDTO = mapperService.toResponseDTO(post);
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Partially update a post that belongs to the current user
     * 
     * @param postId the post ID to update
     * @param postRequestDTO the partial post data to update
     * @return the updated post as DTO
     */
    @PatchMapping("/{postId}")
    public ResponseEntity<UserPostResponseDTO> partialUpdateUserPost(
            @PathVariable String postId, 
            @RequestBody UserPostRequestDTO postRequestDTO) {
        
        try {
            // Get existing post
            Post existingPost = userPostService.getCurrentUserPostById(postId)
                    .orElseThrow(() -> new RuntimeException("Post not found"));
            
            // Update only provided fields
            mapperService.updateEntityFromDTO(existingPost, postRequestDTO);
            
            // Save updated post
            Post updatedPost = userPostService.updateUserPost(postId, existingPost);
            UserPostResponseDTO responseDTO = mapperService.toResponseDTO(updatedPost);
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Delete a post that belongs to the current user
     * 
     * @param postId the post ID to delete
     * @return success response
     */
    @DeleteMapping("/{postId}")
    public ResponseEntity<Map<String, String>> deleteUserPost(@PathVariable String postId) {
        try {
            boolean deleted = userPostService.deleteUserPost(postId);
            if (deleted) {
                return ResponseEntity.ok(Map.of("message", "Post deleted successfully"));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get the count of posts for the current user
     * 
     * @return post count
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getCurrentUserPostCount() {
        long count = userPostService.getCurrentUserPostCount();
        return ResponseEntity.ok(Map.of("count", count));
    }

    /**
     * Check if a post belongs to the current user
     * 
     * @param postId the post ID to check
     * @return ownership status
     */
    @GetMapping("/{postId}/ownership")
    public ResponseEntity<Map<String, Boolean>> checkPostOwnership(@PathVariable String postId) {
        boolean isOwner = userPostService.isCurrentUserPost(postId);
        return ResponseEntity.ok(Map.of("isOwner", isOwner));
    }

    /**
     * Get posts statistics for the current user
     * 
     * @return statistics including total posts, likes, supports, comments
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getCurrentUserPostStatistics() {
        Page<Post> allUserPosts = userPostService.getCurrentUserPosts(0, Integer.MAX_VALUE, true);
        
        long totalPosts = allUserPosts.getTotalElements();
        long totalLikes = allUserPosts.getContent().stream().mapToLong(Post::getLikes).sum();
        long totalSupports = allUserPosts.getContent().stream().mapToLong(Post::getSupports).sum();
        long totalComments = allUserPosts.getContent().stream().mapToLong(Post::getComments).sum();
        
        Map<String, Object> statistics = Map.of(
                "totalPosts", totalPosts,
                "totalLikes", totalLikes,
                "totalSupports", totalSupports,
                "totalComments", totalComments,
                "averageLikesPerPost", totalPosts > 0 ? (double) totalLikes / totalPosts : 0.0,
                "averageSupportsPerPost", totalPosts > 0 ? (double) totalSupports / totalPosts : 0.0,
                "averageCommentsPerPost", totalPosts > 0 ? (double) totalComments / totalPosts : 0.0
        );
        
        return ResponseEntity.ok(statistics);
    }
}