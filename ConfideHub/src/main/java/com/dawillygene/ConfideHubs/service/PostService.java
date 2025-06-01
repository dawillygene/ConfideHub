package com.dawillygene.ConfideHubs.service;

import com.dawillygene.ConfideHubs.controllers.GeminiModelController;
import com.dawillygene.ConfideHubs.model.Post;
import com.dawillygene.ConfideHubs.model.Post.ExpiryDuration;
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
    private AnonymousUsernameService anonymousUsernameService;

    @Autowired
    private GeminiModelController geminiModelController;

    @Transactional
    public Post createPost(Post post) {

        if (post.getId() == null) {
            post.setId(UUID.randomUUID().toString());
        }

        post.setCreatedAt(LocalDateTime.now());

        if (post.getExpiryDuration() != null) {
            post.setExpiresAt(post.getExpiryDuration().calculateExpiryDate(post.getCreatedAt()));
        } else {
            post.setExpiryDuration(ExpiryDuration.NEVER);
            post.setExpiresAt(null);
        }

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        post.setUserId(user.getId());

        String anonymousUsername = anonymousUsernameService.generateDeterministicUsername(post.getId());
        post.setDisplayUsername(anonymousUsername);

        if (post.getContent() != null && !post.getContent().isEmpty()) {
            String generatedTitle = geminiModelController.generateTitle(post.getContent());
            post.setGeneratedTitle(generatedTitle);
        }

        Post savedPost = postRepository.save(post);

        savedPost.setDisplayUsername(anonymousUsername);
        return savedPost;
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

        LocalDateTime now = LocalDateTime.now();
        Page<Post> posts = postRepository.findNonExpiredPosts(now, pageable);

        for (Post post : posts.getContent()) {
            String anonymousUsername = anonymousUsernameService.generateDeterministicUsername(post.getId());
            post.setDisplayUsername(anonymousUsername);
        }

        return posts;
    }

    public Optional<Post> getPostById(String id) {
        Optional<Post> postOptional = postRepository.findById(id);

        if (postOptional.isPresent() && postOptional.get().isExpired()) {
            return Optional.empty();
        }

        postOptional.ifPresent(post -> {
            String anonymousUsername = anonymousUsernameService.generateDeterministicUsername(post.getId());
            post.setDisplayUsername(anonymousUsername);
        });

        return postOptional;
    }

    public Post updatePost(String id, Post updatedPost) {
        return postRepository.findById(id)
                .map(existingPost -> {

                    if (existingPost.isExpired()) {
                        throw new RuntimeException("Cannot update an expired post");
                    }

                    existingPost.setTitle(updatedPost.getTitle());
                    existingPost.setContent(updatedPost.getContent());
                    existingPost.setCategories(updatedPost.getCategories());
                    existingPost.setHashtags(updatedPost.getHashtags());

                    if (existingPost.getExpiryDuration() == ExpiryDuration.NEVER && updatedPost.getExpiryDuration() != null) {
                        existingPost.setExpiryDuration(updatedPost.getExpiryDuration());
                        existingPost.setExpiresAt(updatedPost.getExpiryDuration().calculateExpiryDate(existingPost.getCreatedAt()));
                    }

                    Post savedPost = postRepository.save(existingPost);

                    String anonymousUsername = anonymousUsernameService.generateDeterministicUsername(savedPost.getId());
                    savedPost.setDisplayUsername(anonymousUsername);

                    return savedPost;
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

        if (post.isExpired()) {
            throw new RuntimeException("Cannot react to an expired post");
        }

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

        Post savedPost = postRepository.save(post);

        String anonymousUsername = anonymousUsernameService.generateDeterministicUsername(savedPost.getId());
        savedPost.setDisplayUsername(anonymousUsername);

        return savedPost;
    }

    private void updatePostReactionCounts(Post post, String reactionType, int change) {
        switch (reactionType.toLowerCase()) {
            case "like": post.setLikes(post.getLikes() + change); break;
            case "support": post.setSupports(post.getSupports() + change); break;
            case "comment": post.setComments(post.getComments() + change); break;
            case "bookmark": post.setBookmarked(change > 0); break;
        }
    }

    public void setRandomDisplayNames(List<Post> posts) {
        for (Post post : posts) {
            String anonymousUsername = anonymousUsernameService.generateDeterministicUsername(post.getId());
            post.setDisplayUsername(anonymousUsername);
        }
    }

    @Async
    @Scheduled(fixedRate = 3600000)
    public void calculateTrendingScoresAndCleanExpiredPosts() {
        List<Post> allPosts = postRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        for (Post post : allPosts) {
            if (post.getExpiresAt() != null && now.isAfter(post.getExpiresAt())) {
                logger.info("Deleting expired post: {}", post.getId());
                postRepository.deleteById(post.getId());
                continue;
            }

            long likeCount = reactionRepository.countByPostIdAndReactionType(post.getId(), "like");
            long supportCount = reactionRepository.countByPostIdAndReactionType(post.getId(), "support");
            long commentCount = reactionRepository.countByPostIdAndReactionType(post.getId(), "comment");

            java.time.ZoneOffset currentOffset = java.time.OffsetDateTime.now().getOffset();

            long nowEpochSecond = now.toEpochSecond(currentOffset);
            long createdAtEpochSecond = post.getCreatedAt().toEpochSecond(currentOffset);

            double timeFactor = Math.exp(-0.00001 * (nowEpochSecond - createdAtEpochSecond)); // Exponential decay
            double trendingScore = (likeCount * 1 + supportCount * 2 + commentCount * 1.5) * timeFactor;
            post.setTrendingScore(trendingScore);
            postRepository.save(post);
            logger.debug("Calculated trending score {} for post {}", trendingScore, post.getId());
        }
        logger.info("Trending scores updated and expired posts cleaned.");
    }

    private Long getCurrentUserId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Page<Post> getBookmarkedPosts(int page, int size) {
        Long userId = getCurrentUserId();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("createdAt")));

        // Get posts ids that are bookmarked by the current user
        List<String> bookmarkedPostIds = reactionRepository.findByUserIdAndReactionType(userId, "bookmark")
                .stream()
                .map(reaction -> reaction.getPost().getId())
                .toList();

        if (bookmarkedPostIds.isEmpty()) {
            return new PageImpl<>(List.of(), pageable, 0);
        }

        LocalDateTime now = LocalDateTime.now();
        List<Post> bookmarkedPosts = postRepository.findByIdInAndExpiresAtIsNullOrExpiresAtAfter(
                bookmarkedPostIds, now, pageable).getContent();

        setRandomDisplayNames(bookmarkedPosts);
        bookmarkedPosts.forEach(post -> post.setBookmarked(true));

        return new PageImpl<>(bookmarkedPosts, pageable, bookmarkedPosts.size());
    }
}
