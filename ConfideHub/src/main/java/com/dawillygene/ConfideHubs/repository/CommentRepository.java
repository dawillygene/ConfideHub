package com.dawillygene.ConfideHubs.repository;

import com.dawillygene.ConfideHubs.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostIdAndParentIsNullOrderByCreatedAtAsc(String postId);
    List<Comment> findByParentIdOrderByCreatedAtAsc(Long parentId);
}