package com.dawillygene.ConfideHubs.service;

import com.dawillygene.ConfideHubs.model.Comment;
import com.dawillygene.ConfideHubs.model.Post;
import com.dawillygene.ConfideHubs.model.User;
import com.dawillygene.ConfideHubs.repository.CommentRepository;
import com.dawillygene.ConfideHubs.repository.PostRepository;
import com.dawillygene.ConfideHubs.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    private static final Logger logger = LoggerFactory.getLogger(CommentService.class);

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

    /**
     * Delete a comment by ID.
     * @param commentId The ID of the comment to delete
     * @return true if the comment was deleted successfully, false if the comment doesn't exist
     * @throws org.springframework.security.access.AccessDeniedException if the user is not authorized to delete the comment
     */
    @Transactional
    public boolean deleteComment(Long commentId) {
        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        if (commentOptional.isPresent()) {
            Comment comment = commentOptional.get();
            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            if (comment.getUser().getUsername().equals(currentUsername)) {
                String postId = comment.getPost().getId();
                commentRepository.deleteById(commentId);
                updateCommentCount(postId, -1); // Decrement comment count
                logger.info("Comment with ID {} deleted successfully by {}", commentId, currentUsername);
                return true;
            } else {
                throw new org.springframework.security.access.AccessDeniedException("You are not authorized to delete this comment.");
            }
        } else {
            logger.warn("Attempted to delete non-existent comment with ID: {}", commentId);
            return false; // Comment doesn't exist, but don't treat it as an error
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