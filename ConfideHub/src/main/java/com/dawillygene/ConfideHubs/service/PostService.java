package com.dawillygene.ConfideHubs.service;

import com.dawillygene.ConfideHubs.model.Post;
import com.dawillygene.ConfideHubs.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

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

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Optional<Post> getPostById(String id) {
        return postRepository.findById(id);
    }

    public Post updatePost(String id, Post updatedPost) {
        Optional<Post> existingPost = postRepository.findById(id);
        if (existingPost.isPresent()) {
            Post post = existingPost.get();
            post.setTitle(updatedPost.getTitle());
            post.setContent(updatedPost.getContent());
            post.setCategories(updatedPost.getCategories());
            post.setHashtags(updatedPost.getHashtags());
            post.setLikes(updatedPost.getLikes());
            post.setSupports(updatedPost.getSupports());
            post.setComments(updatedPost.getComments());
            post.setBookmarked(updatedPost.isBookmarked());
            return postRepository.save(post);
        }
        throw new RuntimeException("Post not found");
    }

    public void deletePost(String id) {
        postRepository.deleteById(id);
    }

    public Post updateReaction(String id, String reactionType) {
        Optional<Post> optionalPost = postRepository.findById(id);
        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
            switch (reactionType) {
                case "like":
                    post.setLikes(post.getLikes() + 1);
                    break;
                case "support":
                    post.setSupports(post.getSupports() + 1);
                    break;
                case "bookmark":
                    post.setBookmarked(!post.isBookmarked());
                    break;
            }
            return postRepository.save(post);
        }
        throw new RuntimeException("Post not found");
    }
}
