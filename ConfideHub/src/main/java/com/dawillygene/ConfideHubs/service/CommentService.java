package com.dawillygene.ConfideHubs.service;

import com.dawillygene.ConfideHubs.model.Comment;
import com.dawillygene.ConfideHubs.model.Post;
import com.dawillygene.ConfideHubs.model.User;
import com.dawillygene.ConfideHubs.repository.CommentRepository;
import com.dawillygene.ConfideHubs.repository.PostRepository;
import com.dawillygene.ConfideHubs.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Comment addComment(String postId, Long parentId, String content) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setContent(content);

        if (parentId != null) {
            Comment parentComment = commentRepository.findById(parentId)
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            comment.setParent(parentComment);
        }

        Comment savedComment = commentRepository.save(comment);
        updateCommentCount(post.getId(), 1); // Increment comment count
        return savedComment;
    }

    public List<Comment> getCommentsByPost(String postId) {
        return commentRepository.findByPostIdAndParentIsNullOrderByCreatedAtAsc(postId);
    }

    public List<Comment> getRepliesByComment(Long parentId) {
        return commentRepository.findByParentIdOrderByCreatedAtAsc(parentId);
    }

    @Transactional
    public void deleteComment(Long commentId) {
        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        if (commentOptional.isPresent()) {
            Comment comment = commentOptional.get();
            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            if (comment.getUser().getUsername().equals(currentUsername)) {
                String postId = comment.getPost().getId();
                commentRepository.deleteById(commentId);
                updateCommentCount(postId, -1); // Decrement comment count
            } else {
                throw new org.springframework.security.access.AccessDeniedException("You are not authorized to delete this comment.");
            }
        } else {
            throw new RuntimeException("Comment not found with id: " + commentId);
        }
    }

    @Transactional
    public void updateCommentCount(String postId, int change) {
        postRepository.findById(postId)
                .ifPresent(post -> {
                    post.setComments(Math.max(0, post.getComments() + change));
                    postRepository.save(post);
                });
    }
}