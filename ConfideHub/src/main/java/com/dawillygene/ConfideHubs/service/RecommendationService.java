package com.dawillygene.ConfideHubs.service;

import com.dawillygene.ConfideHubs.model.Post;
import com.dawillygene.ConfideHubs.model.Reaction;
import com.dawillygene.ConfideHubs.model.User;
import com.dawillygene.ConfideHubs.repository.PostRepository;
import com.dawillygene.ConfideHubs.repository.ReactionRepository;
import com.dawillygene.ConfideHubs.repository.UserRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private static final Logger logger = LoggerFactory.getLogger(RecommendationService.class); // Add logger

    private final PostRepository postRepository;
    private final ReactionRepository reactionRepository;
    private final UserRepository userRepository;
    private final double collaborativeWeight = 0.6;
    private final double contentWeight = 0.4;

    public RecommendationService(PostRepository postRepository,
                                ReactionRepository reactionRepository,
                                UserRepository userRepository) {
        this.postRepository = postRepository;
        this.reactionRepository = reactionRepository;
        this.userRepository = userRepository;
    }

    @Cacheable(value = "recommendations", key = "#userId + '_' + #numberOfRecommendations")
    @Transactional(readOnly = true)
    public List<Post> getRecommendedPosts(Long userId, int numberOfRecommendations) {
        if (userId == null) {
            return Collections.emptyList();
        }

        Map<String, Double> cfScores = getCollaborativeScores(userId);
        Map<String, Double> cbScores = getContentBasedScores(userId);
        Map<String, Double> finalScores = new HashMap<>();

        List<Post> allPosts = postRepository.findAll();
        Set<String> interactedPostIds = reactionRepository.findByUserId(userId).stream()
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

    protected Map<Long, Map<String, Integer>> getUserPostInteractionMatrix() {
        List<Reaction> allReactions = reactionRepository.findAll();
        Map<Long, Map<String, Integer>> interactionMatrix = new HashMap<>();

        for (Reaction reaction : allReactions) {
            // Skip reactions with null user or post
            if (reaction.getUser() == null || reaction.getPost() == null) {
                continue;
            }

            Long userId = reaction.getUser().getId();
            String postId = reaction.getPost().getId();
            String reactionType = reaction.getReactionType();

            if (userId == null || postId == null || reactionType == null) {
                continue;
            }

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

    protected Map<String, Double> getCollaborativeScores(Long targetUserId) {
        Map<Long, Map<String, Integer>> interactionMatrix = getCachedUserPostInteractionMatrix();
        Map<String, Integer> targetUserInteractions = interactionMatrix.getOrDefault(targetUserId, new HashMap<>());
        Map<String, Double> cfScores = new HashMap<>();

        interactionMatrix.entrySet().parallelStream()
            .filter(userEntry -> !userEntry.getKey().equals(targetUserId))
            .forEach(userEntry -> {
                double similarity = cosineSimilarity(targetUserInteractions, userEntry.getValue());
                userEntry.getValue().entrySet().parallelStream()
                    .filter(postEntry -> !targetUserInteractions.containsKey(postEntry.getKey()))
                    .forEach(postEntry -> {
                        String postId = postEntry.getKey();
                        synchronized(cfScores) {
                            cfScores.put(postId, cfScores.getOrDefault(postId, 0.0) + similarity * postEntry.getValue());
                        }
                    });
            });

        return cfScores;
    }

    protected Map<Long, Set<String>> getUserContentPreferences() {
        List<Reaction> allReactions = reactionRepository.findAll();
        Map<Long, Set<String>> userPreferences = new HashMap<>();
        for (Reaction reaction : allReactions) {
            if (reaction == null) { // Check if reaction object itself is null
                logger.warn("Encountered a null reaction object. Skipping.");
                continue;
            }
            if (isPositiveReaction(reaction.getReactionType())) {
                User user = reaction.getUser();
                // Add null check for user and user ID
                if (user == null || user.getId() == null) {
                    logger.warn("Reaction {} has a null user or user with null ID. Skipping.", reaction.getId());
                    continue;
                }
                Long userId = user.getId();
                Post post = reaction.getPost();
                // Add null check for post and post ID
                if (post == null || post.getId() == null) {
                    logger.warn("Reaction {} for user {} has a null post or post with null ID. Skipping.", reaction.getId(), userId);
                    continue;
                }
                // At this point, post and post.getId() are confirmed not null.
                Set<String> keywords = new HashSet<>();
                if (post.getCategories() != null) {
                    keywords.addAll(post.getCategories());
                }
                if (post.getHashtags() != null) {
                    keywords.addAll(post.getHashtags());
                }
                userPreferences.computeIfAbsent(userId, k -> new HashSet<>()).addAll(keywords);
            }
        }
        return userPreferences;
    }

    protected Map<String, Set<String>> getPostContentFeatures() {
        List<Post> allPosts = postRepository.findAll();
        Map<String, Set<String>> postFeatures = new HashMap<>();
        for (Post post : allPosts) {
            // Add null check for post and its ID
            if (post == null || post.getId() == null) {
                logger.warn("Encountered a null post or post with null ID in findAll result. Skipping.");
                continue;
            }
            Set<String> keywords = new HashSet<>();
            if (post.getCategories() != null) {
                keywords.addAll(post.getCategories());
            }
            if (post.getHashtags() != null) {
                keywords.addAll(post.getHashtags());
            }
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

    protected Map<String, Double> getContentBasedScores(Long targetUserId) {
        Map<Long, Set<String>> userPreferences = getCachedUserContentPreferences();
        Map<String, Set<String>> postFeatures = getCachedPostContentFeatures();
        Map<String, Double> cbScores = new HashMap<>();
        
        User currentUser = userRepository.findById(targetUserId).orElse(null);
        if (currentUser == null || !userPreferences.containsKey(targetUserId)) {
            return cbScores;
        }
        
        Set<String> currentUserKeywords = userPreferences.get(targetUserId);
        List<Post> allPosts = postRepository.findAll();
        Set<String> interactedPostIds = reactionRepository.findByUserId(targetUserId).stream()
                .map(reaction -> reaction.getPost().getId())
                .collect(Collectors.toSet());

        return allPosts.parallelStream()
            .filter(post -> !interactedPostIds.contains(post.getId()))
            .collect(Collectors.toConcurrentMap(
                Post::getId,
                post -> {
                    Set<String> postKeywords = postFeatures.getOrDefault(post.getId(), new HashSet<>());
                    return contentSimilarity(currentUserKeywords, postKeywords);
                }
            ));
    }

    public List<Post> getRecommendedPosts(int numberOfRecommendations) {
        Long currentUserId = getCurrentUserId();
        return getRecommendedPosts(currentUserId, numberOfRecommendations);
    }

    private Long getCurrentUserId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .map(User::getId)
                .orElse(null);
    }

    @Cacheable(value = "userInteractionMatrix", key = "'all_users'")
    public Map<Long, Map<String, Integer>> getCachedUserPostInteractionMatrix() {
        return getUserPostInteractionMatrix();
    }

    @Cacheable(value = "userPreferences", key = "'all_preferences'")
    public Map<Long, Set<String>> getCachedUserContentPreferences() {
        return getUserContentPreferences();
    }

    @Cacheable(value = "postFeatures", key = "'all_posts'")
    public Map<String, Set<String>> getCachedPostContentFeatures() {
        return getPostContentFeatures();
    }

    @CacheEvict(value = {"recommendations", "userInteractionMatrix", "userPreferences", "postFeatures"}, allEntries = true)
    @Scheduled(fixedRate = 3600000)
    public void clearRecommendationCache() {
        // Cache will be cleared automatically
    }
}

