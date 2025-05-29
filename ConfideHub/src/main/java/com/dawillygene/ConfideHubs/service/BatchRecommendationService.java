package com.dawillygene.ConfideHubs.service;

import com.dawillygene.ConfideHubs.model.Post;
import com.dawillygene.ConfideHubs.model.User;
import com.dawillygene.ConfideHubs.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BatchRecommendationService {

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private UserRepository userRepository;

    private final Map<Long, List<Post>> precomputedRecommendations = new HashMap<>();

    @Scheduled(fixedRate = 1800000) // Run every 30 minutes
    @Transactional
    public void precomputeRecommendations() {
        List<User> allUsers = userRepository.findAll();
        
        allUsers.parallelStream().forEach(user -> {
            try {
                List<Post> recommendations = recommendationService.getRecommendedPosts(user.getId(), 20);
                precomputedRecommendations.put(user.getId(), recommendations);
            } catch (Exception e) {
                // Log error but continue processing other users
                System.err.println("Error precomputing recommendations for user " + user.getId() + ": " + e.getMessage());
            }
        });
    }

    public List<Post> getPrecomputedRecommendations(Long userId, int limit) {
        List<Post> recommendations = precomputedRecommendations.get(userId);
        if (recommendations != null && !recommendations.isEmpty()) {
            return recommendations.stream().limit(limit).collect(java.util.stream.Collectors.toList());
        }
        // Fallback to real-time computation
        return recommendationService.getRecommendedPosts(userId, limit);
    }
}