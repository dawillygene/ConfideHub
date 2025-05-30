package com.dawillygene.ConfideHubs.service;

import com.dawillygene.ConfideHubs.controllers.GeminiModelController;
import com.dawillygene.ConfideHubs.model.Post;
import com.dawillygene.ConfideHubs.model.Reaction;
import com.dawillygene.ConfideHubs.model.User;
import com.dawillygene.ConfideHubs.repository.PostRepository;
import com.dawillygene.ConfideHubs.repository.ReactionRepository;
import com.dawillygene.ConfideHubs.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PostService {

    private static final Logger logger = LoggerFactory.getLogger(PostService.class);

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ReactionRepository reactionRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private GeminiModelController geminiModelController;

    @Transactional
    public Post createPost(Post post) {
        // Generate UUID if not provided
        if (post.getId() == null) {
            post.setId(UUID.randomUUID().toString());
        }
        
        // Set creation time
        post.setCreatedAt(LocalDateTime.now());
        
        // Generate title using Gemini AI
        if (post.getContent() != null && !post.getContent().isEmpty()) {
            String generatedTitle = geminiModelController.generateTitle(post.getContent());
            post.setGeneratedTitle(generatedTitle);
        }
        
        // Save and return the post
        return postRepository.save(post);
    }


    public Page<Post> getAllPosts(int page, int size, String sortBy) {
        Sort sort = Sort.by(Sort.Order.desc("createdAt"));
        if ("trending".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Order.desc("trendingScore"))
                    .and(Sort.by(Sort.Order.desc("createdAt")))
                    .and(Sort.by(Sort.Order.asc("id")));
        } else if ("newest".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Order.desc("createdAt"))
                    .and(Sort.by(Sort.Order.asc("id")));
        }
        Pageable pageable = PageRequest.of(page, size, sort);
        return postRepository.findAll(pageable);
    }

    public Optional<Post> getPostById(String id) {
        return postRepository.findById(id);
    }

    public Post updatePost(String id, Post updatedPost) {
        return postRepository.findById(id)
                .map(existingPost -> {
                    existingPost.setTitle(updatedPost.getTitle());
                    existingPost.setContent(updatedPost.getContent());
                    existingPost.setCategories(updatedPost.getCategories());
                    existingPost.setHashtags(updatedPost.getHashtags());
                    return postRepository.save(existingPost);
                })
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    public void deletePost(String id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
        } else {
            throw new RuntimeException("Post not found");
        }
    }

    @Transactional
    public Post updateReaction(String postId, String reactionType) {
        if (!List.of("like", "support", "comment", "bookmark").contains(reactionType.toLowerCase())) {
            throw new IllegalArgumentException("Invalid reaction type: " + reactionType);
        }

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Optional<Reaction> existingReaction = reactionRepository
                .findByPostIdAndUserIdAndReactionType(postId, user.getId(), reactionType);

        if (existingReaction.isPresent()) {
            reactionRepository.delete(existingReaction.get());
            updatePostReactionCounts(post, reactionType, -1);
        } else {
            Reaction reaction = new Reaction();
            reaction.setPost(post);
            reaction.setUser(user);
            reaction.setReactionType(reactionType);
            reactionRepository.save(reaction);
            updatePostReactionCounts(post, reactionType, 1);
        }
        return postRepository.save(post);
    }

    private void updatePostReactionCounts(Post post, String reactionType, int change) {
        switch (reactionType.toLowerCase()) {
            case "like": post.setLikes(post.getLikes() + change); break;
            case "support": post.setSupports(post.getSupports() + change); break;
            case "comment": post.setComments(post.getComments() + change); break;
        }
    }


//    @Scheduled(fixedRate = 3600000) // Run every hour
    @Async
    @Scheduled(fixedRate = 120000)
    public void calculateTrendingScores() {
        List<Post> allPosts = postRepository.findAll();
        LocalDateTime now = LocalDateTime.now();
        for (Post post : allPosts) {
            long likeCount = reactionRepository.countByPostIdAndReactionType(post.getId(), "like");
            long supportCount = reactionRepository.countByPostIdAndReactionType(post.getId(), "support");
            long commentCount = reactionRepository.countByPostIdAndReactionType(post.getId(), "comment");

            // Get ZoneOffset for the current time zone (you might want to make this configurable)
            java.time.ZoneOffset currentOffset = java.time.OffsetDateTime.now().getOffset();

            long nowEpochSecond = now.toEpochSecond(currentOffset);
            long createdAtEpochSecond = post.getCreatedAt().toEpochSecond(currentOffset);

            double timeFactor = Math.exp(-0.00001 * (nowEpochSecond - createdAtEpochSecond)); // Exponential decay
            double trendingScore = (likeCount * 1 + supportCount * 2 + commentCount * 1.5) * timeFactor;
            post.setTrendingScore(trendingScore);
            postRepository.save(post);
            logger.debug("Calculated trending score {} for post {}", trendingScore, post.getId());
        }
        logger.info("Trending scores updated.");
    }

    private Long getCurrentUserId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}