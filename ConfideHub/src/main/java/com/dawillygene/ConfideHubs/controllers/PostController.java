package com.dawillygene.ConfideHubs.controllers;

import com.dawillygene.ConfideHubs.model.Comment;
import com.dawillygene.ConfideHubs.model.Post;
import com.dawillygene.ConfideHubs.service.CommentService;
import com.dawillygene.ConfideHubs.service.PostService;
import com.dawillygene.ConfideHubs.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private CommentService commentService;



    @GetMapping("/recommendations")
    public ResponseEntity<List<Post>> getRecommendedPosts(@RequestParam(defaultValue = "10") int limit) {
        List<Post> recommendedPosts = recommendationService.getRecommendedPosts(limit);
        return ResponseEntity.ok(recommendedPosts);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        return ResponseEntity.ok(postService.createPost(post));
    }

    @GetMapping
    public ResponseEntity<Page<Post>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "newest") String sortBy) {
        return ResponseEntity.ok(postService.getAllPosts(page, size, sortBy));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        return postService.getPostById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Post> updatePost(@PathVariable String id, @RequestBody Post post) {
        return ResponseEntity.ok(postService.updatePost(id, post));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        postService.deletePost(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{postId}/comments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Comment> addComment(
            @PathVariable String postId,
            @RequestParam(required = false) Long parentId,
            @RequestParam String content) {
        Comment addedComment = commentService.addComment(postId, parentId, content);
        return ResponseEntity.ok(addedComment);
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<Comment>> getCommentsByPost(@PathVariable String postId) {
        List<Comment> comments = commentService.getCommentsByPost(postId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/comments/{commentId}/replies")
    public ResponseEntity<List<Comment>> getRepliesByComment(@PathVariable Long commentId) {
        List<Comment> replies = commentService.getRepliesByComment(commentId);
        return ResponseEntity.ok(replies);
    }

    @DeleteMapping("/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/react/{reactionType}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Post> reactToPost(@PathVariable String id, @PathVariable String reactionType) {
        return ResponseEntity.ok(postService.updateReaction(id, reactionType));
    }
}