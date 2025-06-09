package com.dawillygene.ConfideHubs.repository;

import com.dawillygene.ConfideHubs.model.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    long countByPostIdAndReactionType(String postId, String reactionType);
    long countByPostIdAndReactionTypeAndCreatedAtBefore(String postId, String reactionType, LocalDateTime cutoff);
    Optional<Reaction> findByPostIdAndUserIdAndReactionType(String postId, Long userId, String reactionType);


    List<Reaction> findByUserId(Long userId);

    // Add index: CREATE INDEX idx_reaction_post_id ON reactions(post_id);
    List<Reaction> findByPostId(String postId);

    // Add composite index: CREATE INDEX idx_reaction_user_post ON reactions(user_id, post_id);
    @Query("SELECT r FROM Reaction r WHERE r.user.id = :userId AND r.post.id = :postId")
    List<Reaction> findByUserIdAndPostId(@Param("userId") Long userId, @Param("postId") String postId);

    // Add index: CREATE INDEX idx_reaction_type ON reactions(reaction_type);
    List<Reaction> findByReactionType(String reactionType);

    @Modifying
    @Transactional
    @Query("DELETE FROM Reaction r WHERE r.post.id = :postId")
    void deleteByPostId(@Param("postId") String postId);

    // Find all reactions of a specific type for a user
    List<Reaction> findByUserIdAndReactionType(Long userId, String reactionType);
}

