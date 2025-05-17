package com.dawillygene.ConfideHubs.service;

import com.dawillygene.ConfideHubs.model.Post;
import com.dawillygene.ConfideHubs.model.Reaction;
import com.dawillygene.ConfideHubs.model.User;
import com.dawillygene.ConfideHubs.repository.PostRepository;
import com.dawillygene.ConfideHubs.repository.ReactionRepository;
import com.dawillygene.ConfideHubs.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ReactionRepository reactionRepository;

    @Autowired
    private UserRepository userRepository;

    // Configuration for weights (can be moved to application.properties)
    private double collaborativeWeight = 0.6;
    private double contentWeight = 0.4;

    // --- Collaborative Filtering Logic ---

    private Map<Long, Map<String, Integer>> getUserPostInteractionMatrix() {
        List<Reaction> allReactions = reactionRepository.findAll();
        Map<Long, Map<String, Integer>> interactionMatrix = new HashMap<>();
        for (Reaction reaction : allReactions) {
            Long userId = reaction.getUser().getId();
            String postId = reaction.getPost().getId();
            String reactionType = reaction.getReactionType();
            int weight = getReactionWeight(reactionType);
            interactionMatrix.computeIfAbsent(userId, k -> new HashMap<>())
                    .put(postId, interactionMatrix.get(userId).getOrDefault(postId, 0) + weight);
        }
        return interactionMatrix;
    }

    private int getReactionWeight(String reactionType) {
        return switch (reactionType.toLowerCase()) {
            case "like" -> 1;
            case "support" -> 2;
            case "comment" -> 3;
            case "bookmark" -> 4;
            default -> 0;
        };
    }

    private double cosineSimilarity(Map<String, Integer> userInteractions1, Map<String, Integer> userInteractions2) {
        Set<String> allPosts = new HashSet<>();
        allPosts.addAll(userInteractions1.keySet());
        allPosts.addAll(userInteractions2.keySet());

        double dotProduct = 0;
        double magnitude1 = 0;
        double magnitude2 = 0;

        for (String postId : allPosts) {
            int rating1 = userInteractions1.getOrDefault(postId, 0);
            int rating2 = userInteractions2.getOrDefault(postId, 0);

            dotProduct += rating1 * rating2;
            magnitude1 += Math.pow(rating1, 2);
            magnitude2 += Math.pow(rating2, 2);
        }

        if (magnitude1 == 0 || magnitude2 == 0) {
            return 0;
        }

        return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
    }

    private Map<String, Double> getCollaborativeScores(Long targetUserId) {
        Map<Long, Map<String, Integer>> interactionMatrix = getUserPostInteractionMatrix();
        Map<String, Integer> targetUserInteractions = interactionMatrix.getOrDefault(targetUserId, new HashMap<>());
        Map<String, Double> cfScores = new HashMap<>();

        for (Map.Entry<Long, Map<String, Integer>> userEntry : interactionMatrix.entrySet()) {
            Long otherUserId = userEntry.getKey();
            if (!otherUserId.equals(targetUserId)) {
                double similarity = cosineSimilarity(targetUserInteractions, userEntry.getValue());
                for (Map.Entry<String, Integer> postEntry : userEntry.getValue().entrySet()) {
                    String postId = postEntry.getKey();
                    if (!targetUserInteractions.containsKey(postId)) {
                        cfScores.put(postId, cfScores.getOrDefault(postId, 0.0) + similarity * postEntry.getValue());
                    }
                }
            }
        }
        return cfScores;
    }

    // --- Content-Based Filtering Logic ---

    private Map<Long, Set<String>> getUserContentPreferences() {
        List<Reaction> allReactions = reactionRepository.findAll();
        Map<Long, Set<String>> userPreferences = new HashMap<>();
        for (Reaction reaction : allReactions) {
            if (isPositiveReaction(reaction.getReactionType())) {
                Long userId = reaction.getUser().getId();
                Post post = reaction.getPost();
                Set<String> keywords = new HashSet<>();
                if (post.getCategories() != null) keywords.addAll(post.getCategories());
                if (post.getHashtags() != null) keywords.addAll(post.getHashtags());
                userPreferences.computeIfAbsent(userId, k -> new HashSet<>()).addAll(keywords);
            }
        }
        return userPreferences;
    }

    private Map<String, Set<String>> getPostContentFeatures() {
        List<Post> allPosts = postRepository.findAll();
        Map<String, Set<String>> postFeatures = new HashMap<>();
        for (Post post : allPosts) {
            Set<String> keywords = new HashSet<>();
            if (post.getCategories() != null) keywords.addAll(post.getCategories());
            if (post.getHashtags() != null) keywords.addAll(post.getHashtags());
            postFeatures.put(post.getId(), keywords);
        }
        return postFeatures;
    }

    private boolean isPositiveReaction(String reactionType) {
        return List.of("like", "support", "bookmark").contains(reactionType.toLowerCase());
    }

    private double contentSimilarity(Set<String> userKeywords, Set<String> postKeywords) {
        if (userKeywords.isEmpty() || postKeywords.isEmpty()) {
            return 0.0;
        }
        Set<String> intersection = new HashSet<>(userKeywords);
        intersection.retainAll(postKeywords);
        return (double) intersection.size() / Math.sqrt(userKeywords.size() * postKeywords.size());
    }

    private Map<String, Double> getContentBasedScores(Long targetUserId) {
        Map<Long, Set<String>> userPreferences = getUserContentPreferences();
        Map<String, Set<String>> postFeatures = getPostContentFeatures();
        Map<String, Double> cbScores = new HashMap<>();
        User currentUser = userRepository.findById(targetUserId).orElse(null);
        if (currentUser == null || !userPreferences.containsKey(targetUserId)) {
            return cbScores; // Cannot compute if no user preferences
        }
        Set<String> currentUserKeywords = userPreferences.get(targetUserId);
        List<Post> allPosts = postRepository.findAll();
        Set<String> interactedPostIds = reactionRepository.findByUserId(targetUserId).stream()
                .map(reaction -> reaction.getPost().getId())
                .collect(Collectors.toSet());

        for (Post post : allPosts) {
            if (!interactedPostIds.contains(post.getId())) {
                Set<String> postKeywords = postFeatures.getOrDefault(post.getId(), new HashSet<>());
                double similarity = contentSimilarity(currentUserKeywords, postKeywords);
                cbScores.put(post.getId(), similarity);
            }
        }
        return cbScores;
    }

    // --- Weighted Hybrid Recommendation ---

    public List<Post> getRecommendedPosts(int numberOfRecommendations) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return Collections.emptyList(); // Or handle anonymous users differently
        }

        Map<String, Double> cfScores = getCollaborativeScores(currentUserId);
        Map<String, Double> cbScores = getContentBasedScores(currentUserId);
        Map<String, Double> finalScores = new HashMap<>();

        List<Post> allPosts = postRepository.findAll();
        Set<String> interactedPostIds = reactionRepository.findByUserId(currentUserId).stream()
                .map(reaction -> reaction.getPost().getId())
                .collect(Collectors.toSet());

        for (Post post : allPosts) {
            if (!interactedPostIds.contains(post.getId())) {
                double cfScore = cfScores.getOrDefault(post.getId(), 0.0);
                double cbScore = cbScores.getOrDefault(post.getId(), 0.0);
                finalScores.put(post.getId(), (collaborativeWeight * cfScore) + (contentWeight * cbScore));
            }
        }

        return finalScores.entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .limit(numberOfRecommendations)
                .map(entry -> postRepository.findById(entry.getKey()).orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    private Long getCurrentUserId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .map(User::getId)
                .orElse(null); // Handle case where user might not be authenticated
    }
}