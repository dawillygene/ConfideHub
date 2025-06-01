package com.dawillygene.ConfideHubs.service;

import com.dawillygene.ConfideHubs.model.Post;
import com.dawillygene.ConfideHubs.model.User;
import com.dawillygene.ConfideHubs.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class BatchRecommendationService {

    private static final Logger logger = LoggerFactory.getLogger(BatchRecommendationService.class);

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private UserRepository userRepository;

    private final Map<Long, List<Post>> precomputedRecommendations = new ConcurrentHashMap<>();

    @Scheduled(fixedRate = 1800000) // Run every 30 minutes
    // Removed @Transactional annotation
    public void precomputeRecommendations() {
        try {
            List<User> allUsers = userRepository.findAll();
            logger.info("Starting precomputation of recommendations for {} users", allUsers.size());

            if (allUsers.isEmpty()) {
                logger.info("No users found for recommendation precomputation");
                return;
            }

            for (User user : allUsers) {
                try {
                    if (user != null && user.getId() != null) {
                        processUserRecommendations(user);
                    } else {
                        logger.warn("Skipping recommendation processing for null user or user with null ID");
                    }
                } catch (Exception e) {
                    // Log error but continue processing other users
                    logger.error("Error precomputing recommendations for user {}: {}",
                            user != null ? user.getId() : "null", e.getMessage());
                }
            }

            logger.info("Finished precomputation of recommendations");
        } catch (Exception e) {
            // Catch all exceptions at the top level to prevent scheduled task from failing
            logger.error("Unexpected error in recommendation precomputation task: {}", e.getMessage(), e);
        }
    }

    // Removed @Transactional annotation
    public void processUserRecommendations(User user) {
        try {
            if (user == null || user.getId() == null) {
                logger.warn("Cannot process recommendations for null user or user with null ID");
                return;
            }

            List<Post> recommendations = Collections.emptyList();
            try {
                recommendations = recommendationService.getRecommendedPosts(user.getId(), 20);
            } catch (Exception e) {
                logger.error("Error getting recommendations for user {}: {}", user.getId(), e.getMessage());
                // Continue with empty recommendations
            }

            precomputedRecommendations.put(user.getId(), recommendations);
            logger.debug("Successfully precomputed {} recommendations for user {}",
                    recommendations.size(), user.getId());
        } catch (Exception e) {
            logger.error("Error processing recommendations for user {}: {}",
                    user != null ? user.getId() : "null", e.getMessage());
            // Store an empty list to prevent repeated failures
            if (user != null && user.getId() != null) {
                precomputedRecommendations.put(user.getId(), Collections.emptyList());
            }
        }
    }

    public List<Post> getPrecomputedRecommendations(Long userId, int limit) {
        if (userId == null) {
            logger.warn("Requested precomputed recommendations for null userId");
            return Collections.emptyList();
        }

        List<Post> recommendations = precomputedRecommendations.get(userId);
        if (recommendations != null && !recommendations.isEmpty()) {
            return recommendations.stream()
                    .limit(limit)
                    .collect(java.util.stream.Collectors.toList());
        }

        // Fallback to real-time computation
        try {
            return recommendationService.getRecommendedPosts(userId, limit);
        } catch (Exception e) {
            logger.error("Error getting real-time recommendations for user {}: {}", userId, e.getMessage());
            return Collections.emptyList();
        }
    }
}
