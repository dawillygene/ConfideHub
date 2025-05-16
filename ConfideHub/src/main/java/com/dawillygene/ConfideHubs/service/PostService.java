package com.dawillygene.ConfideHubs.service;

import com.dawillygene.ConfideHubs.model.Post;
import com.dawillygene.ConfideHubs.model.Reaction;
import com.dawillygene.ConfideHubs.model.User;
import com.dawillygene.ConfideHubs.repository.PostRepository;
import com.dawillygene.ConfideHubs.repository.ReactionRepository;
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

    public Post createPost(Post post) {
        if (post.getId() == null) {
            post.setId(UUID.randomUUID().toString());
        }
        post.setCreatedAt(LocalDateTime.now());
        if (post.getExpiresAt() == null) {
            post.setExpiresAt(LocalDateTime.now().plusDays(7));
        }
        return postRepository.save(post);
    }

    public Page<Post> getAllPosts(int page, int size, String sortBy) {
        // Define sorting logic
        Sort sort;
        switch (sortBy) {
            case "trending":
                // Sort by total reactions (likes + supports) and then by createdAt
                sort = Sort.by(
                        Sort.Order.desc("createdAt") // Fallback to newer posts
                );
                break;
            case "newest":
            default:
                sort = Sort.by(Sort.Order.desc("createdAt"));
                break;
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Post> postPage = postRepository.findAll(pageable);
        postPage.getContent().forEach(this::enrichPostWithReactions);
        return postPage;
    }

    public Optional<Post> getPostById(String id) {
        Optional<Post> post = postRepository.findById(id);
        post.ifPresent(this::enrichPostWithReactions);
        return post;
    }

    public Post updatePost(String id, Post updatedPost) {
        Optional<Post> existingPost = postRepository.findById(id);
        if (existingPost.isPresent()) {
            Post post = existingPost.get();
            post.setTitle(updatedPost.getTitle());
            post.setContent(updatedPost.getContent());
            post.setCategories(updatedPost.getCategories());
            post.setHashtags(updatedPost.getHashtags());
            return postRepository.save(post);
        }
        throw new RuntimeException("Post not found");
    }

    public void deletePost(String id) {
        postRepository.deleteById(id);
    }

    public Post updateReaction(String postId, String reactionType) {
        if (!List.of("like", "dislike", "support", "bookmark").contains(reactionType)) {
            throw new IllegalArgumentException("Invalid reaction type: " + reactionType);
        }

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Post> optionalPost = postRepository.findById(postId);
        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
            Optional<Reaction> existingReaction = reactionRepository
                    .findByPostIdAndUserIdAndReactionType(postId, user.getId(), reactionType);

            if (existingReaction.isPresent()) {
                reactionRepository.delete(existingReaction.get());
                logger.info("Removed {} reaction for post {} by user {}", reactionType, postId, user.getId());
            } else {
                Reaction reaction = new Reaction();
                reaction.setPost(post);
                reaction.setUser(user);
                reaction.setReactionType(reactionType);
                reactionRepository.save(reaction);
                logger.info("Added {} reaction for post {} by user {}", reactionType, postId, user.getId());
            }

            enrichPostWithReactions(post);
            return post;
        }
        throw new RuntimeException("Post not found");
    }

    private void enrichPostWithReactions(Post post) {
        post.setLikes((int) reactionRepository.countByPostIdAndReactionType(post.getId(), "like"));
        post.setSupports((int) reactionRepository.countByPostIdAndReactionType(post.getId(), "support"));
        post.setComments((int) reactionRepository.countByPostIdAndReactionType(post.getId(), "comment"));
        post.setBookmarked(reactionRepository.findByPostIdAndUserIdAndReactionType(
                post.getId(),
                getCurrentUserId(),
                "bookmark"
        ).isPresent());
    }

    private Long getCurrentUserId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}