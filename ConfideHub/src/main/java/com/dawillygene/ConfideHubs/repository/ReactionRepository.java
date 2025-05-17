package com.dawillygene.ConfideHubs.repository;

import com.dawillygene.ConfideHubs.model.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    long countByPostIdAndReactionType(String postId, String reactionType);
    long countByPostIdAndReactionTypeAndCreatedAtBefore(String postId, String reactionType, LocalDateTime cutoff);
    Optional<Reaction> findByPostIdAndUserIdAndReactionType(String postId, Long userId, String reactionType);

    List<Reaction> findByUserId(Long userId); // Corrected method signature
}