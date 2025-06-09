package com.dawillygene.ConfideHubs.service;

import com.dawillygene.ConfideHubs.controllers.GeminiModelController;
import com.dawillygene.ConfideHubs.model.Post;
import com.dawillygene.ConfideHubs.model.Post.ExpiryDuration;
import com.dawillygene.ConfideHubs.model.User;
import com.dawillygene.ConfideHubs.repository.PostRepository;
import com.dawillygene.ConfideHubs.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for managing user-specific posts with full CRUD operations
 * This service ensures users can only access and modify their own posts
 */
@Service
public class UserPostService {

    private static final Logger logger = LoggerFactory.getLogger(UserPostService.class);

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AnonymousUsernameService anonymousUsernameService;

    @Autowired
    private GeminiModelController geminiModelController;

    /**
     * Get all posts for the current authenticated user
     * @param page page number (0-based)
     * @param size number of posts per page
     * @param includeExpired whether to include expired posts
     * @return Page of user's posts
     */
    public Page<Post> getCurrentUserPosts(int page, int size, boolean includeExpired) {
        Long currentUserId = getCurrentUserId();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("createdAt")));

        Page<Post> posts;
        if (includeExpired) {
            posts = postRepository.findByUserId(currentUserId, pageable);
        } else {
            LocalDateTime now = LocalDateTime.now();
            posts = postRepository.findByUserIdAndNotExpired(currentUserId, now, pageable);
        }

        // Set display usernames for posts
        for (Post post : posts.getContent()) {
            String anonymousUsername = anonymousUsernameService.generateDeterministicUsername(post.getId());
            post.setDisplayUsername(anonymousUsername);
        }

        return posts;
    }

    /**
     * Get a specific post by ID that belongs to the current user
     * @param postId the post ID
     * @return Optional of the post if found and belongs to user
     */
    public Optional<Post> getCurrentUserPostById(String postId) {
        Long currentUserId = getCurrentUserId();
        Optional<Post> postOptional = postRepository.findByIdAndUserId(postId, currentUserId);

        postOptional.ifPresent(post -> {
            String anonymousUsername = anonymousUsernameService.generateDeterministicUsername(post.getId());
            post.setDisplayUsername(anonymousUsername);
        });

        return postOptional;
    }

    /**
     * Create a new post for the current user
     * @param post the post to create
     * @return the created post
     */
    @Transactional
    public Post createUserPost(Post post) {
        if (post.getId() == null) {
            post.setId(UUID.randomUUID().toString());
        }

        post.setCreatedAt(LocalDateTime.now());

        // Set expiry duration
        if (post.getExpiryDuration() != null) {
            post.setExpiresAt(post.getExpiryDuration().calculateExpiryDate(post.getCreatedAt()));
        } else {
            post.setExpiryDuration(ExpiryDuration.NEVER);
            post.setExpiresAt(null);
        }

        // Set the current user as the post owner
        User currentUser = getCurrentUser();
        post.setUserId(currentUser.getId());

        // Generate anonymous username for display
        String anonymousUsername = anonymousUsernameService.generateDeterministicUsername(post.getId());
        post.setDisplayUsername(anonymousUsername);

        // Generate title if content is provided
        if (post.getContent() != null && !post.getContent().isEmpty()) {
            String generatedTitle = geminiModelController.generateTitle(post.getContent());
            post.setGeneratedTitle(generatedTitle);
        }

        Post savedPost = postRepository.save(post);
        savedPost.setDisplayUsername(anonymousUsername);

        logger.info("Created new post with ID: {} for user: {}", savedPost.getId(), currentUser.getUsername());
        return savedPost;
    }

    /**
     * Update a post that belongs to the current user
     * @param postId the post ID
     * @param updatedPost the updated post data
     * @return the updated post
     */
    @Transactional
    public Post updateUserPost(String postId, Post updatedPost) {
        Long currentUserId = getCurrentUserId();
        
        return postRepository.findByIdAndUserId(postId, currentUserId)
                .map(existingPost -> {
                    if (existingPost.isExpired()) {
                        throw new RuntimeException("Cannot update an expired post");
                    }

                    // Update allowed fields
                    existingPost.setTitle(updatedPost.getTitle());
                    existingPost.setContent(updatedPost.getContent());
                    existingPost.setCategories(updatedPost.getCategories());
                    existingPost.setHashtags(updatedPost.getHashtags());

                    // Update expiry duration only if it was NEVER before
                    if (existingPost.getExpiryDuration() == ExpiryDuration.NEVER && 
                        updatedPost.getExpiryDuration() != null) {
                        existingPost.setExpiryDuration(updatedPost.getExpiryDuration());
                        existingPost.setExpiresAt(updatedPost.getExpiryDuration()
                                .calculateExpiryDate(existingPost.getCreatedAt()));
                    }

                    // Regenerate title if content changed
                    if (existingPost.getContent() != null && !existingPost.getContent().isEmpty()) {
                        String generatedTitle = geminiModelController.generateTitle(existingPost.getContent());
                        existingPost.setGeneratedTitle(generatedTitle);
                    }

                    Post savedPost = postRepository.save(existingPost);

                    // Set display username
                    String anonymousUsername = anonymousUsernameService.generateDeterministicUsername(savedPost.getId());
                    savedPost.setDisplayUsername(anonymousUsername);

                    logger.info("Updated post with ID: {} for user: {}", postId, getCurrentUser().getUsername());
                    return savedPost;
                })
                .orElseThrow(() -> new RuntimeException("Post not found or you don't have permission to update it"));
    }

    /**
     * Delete a post that belongs to the current user
     * @param postId the post ID to delete
     * @return true if deleted successfully
     */
    @Transactional
    public boolean deleteUserPost(String postId) {
        Long currentUserId = getCurrentUserId();
        
        if (postRepository.existsByIdAndUserId(postId, currentUserId)) {
            postRepository.deleteById(postId);
            logger.info("Deleted post with ID: {} for user: {}", postId, getCurrentUser().getUsername());
            return true;
        } else {
            throw new RuntimeException("Post not found or you don't have permission to delete it");
        }
    }

    /**
     * Get the count of posts for the current user
     * @return number of posts
     */
    public long getCurrentUserPostCount() {
        Long currentUserId = getCurrentUserId();
        return postRepository.countByUserId(currentUserId);
    }

    /**
     * Check if a post belongs to the current user
     * @param postId the post ID
     * @return true if the post belongs to the current user
     */
    public boolean isCurrentUserPost(String postId) {
        Long currentUserId = getCurrentUserId();
        return postRepository.existsByIdAndUserId(postId, currentUserId);
    }

    /**
     * Get the current authenticated user ID
     * @return user ID
     */
    private Long getCurrentUserId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Get the current authenticated user
     * @return User entity
     */
    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}