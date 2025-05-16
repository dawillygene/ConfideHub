package com.dawillygene.ConfideHubs.repository;

import com.dawillygene.ConfideHubs.model.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    Optional<Reaction> findByPostIdAndUserIdAndReactionType(String postId, Long userId, String reactionType);
    long countByPostIdAndReactionType(String postId, String reactionType);
    void deleteByPostIdAndUserIdAndReactionType(String postId, Long userId, String reactionType);
}