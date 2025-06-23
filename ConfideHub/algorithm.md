# ConfideHub Recommendation Algorithm Documentation

## Overview

ConfideHub uses a hybrid recommendation system that combines **Collaborative Filtering** and **Content-Based Filtering** to provide personalized post recommendations to users. The system is designed to suggest relevant posts based on both user behavior patterns and content similarity.

## Architecture Components

### 1. RecommendationService
- **Primary Service**: Core recommendation logic implementation
- **Location**: `com.dawillygene.ConfideHubs.service.RecommendationService`
- **Purpose**: Generates recommendations using hybrid approach

### 2. BatchRecommendationService  
- **Secondary Service**: Precomputation and caching layer
- **Location**: `com.dawillygene.ConfideHubs.service.BatchRecommendationService`
- **Purpose**: Batch processing and performance optimization

## Algorithm Details

### Hybrid Approach Weights
```java
private final double collaborativeWeight = 0.6;  // 60%
private final double contentWeight = 0.4;       // 40%
```

The final recommendation score combines both approaches:
```
Final Score = (0.6 × Collaborative Score) + (0.4 × Content-Based Score)
```

## 1. Collaborative Filtering (CF) Component

### Core Concept
Recommends posts based on user behavior similarity - "Users who liked similar posts will like similar content"

### Implementation Steps

#### Step 1: User-Post Interaction Matrix
```java
Map<Long, Map<String, Integer>> interactionMatrix
```
- **Structure**: `{userId: {postId: weightedScore}}`
- **Data Source**: All user reactions from the database
- **Weighting System**:
  - Like: 1 point
  - Support: 2 points  
  - Comment: 3 points
  - Bookmark: 4 points (highest engagement)

#### Step 2: User Similarity Calculation
Uses **Cosine Similarity** to find similar users:

```java
similarity = dotProduct / (sqrt(magnitude1) * sqrt(magnitude2))
```

**Formula Breakdown**:
- `dotProduct`: Sum of (user1_rating × user2_rating) for all posts
- `magnitude1`: Square root of sum of squared ratings for user1
- `magnitude2`: Square root of sum of squared ratings for user2

#### Step 3: Collaborative Score Generation
For each uninteracted post:
```java
CF_Score = Σ(similarity_with_user_i × user_i_rating_for_post)
```

### Parallel Processing
- Uses `parallelStream()` for performance optimization
- Thread-safe with `synchronized` blocks for score aggregation

## 2. Content-Based Filtering (CB) Component

### Core Concept
Recommends posts based on content similarity to user's past interactions

### Implementation Steps

#### Step 1: User Content Preferences Extraction
```java
Map<Long, Set<String>> userPreferences
```
- **Data Source**: Categories and hashtags from posts user positively reacted to
- **Positive Reactions**: like, support, bookmark (comments excluded to avoid noise)
- **Structure**: `{userId: Set<keywords>}`

#### Step 2: Post Content Features
```java
Map<String, Set<String>> postFeatures  
```
- **Features**: Post categories and hashtags
- **Structure**: `{postId: Set<keywords>}`

#### Step 3: Content Similarity Calculation
Uses **Jaccard-based similarity** with normalization:

```java
intersection_size / sqrt(user_keywords_size × post_keywords_size)
```

**Benefits**:
- Handles different set sizes fairly
- Normalizes scores between 0 and 1
- Rewards relevant overlap without penalizing diversity

## 3. Final Score Calculation & Ranking

### Score Combination
```java
finalScore = (0.6 × collaborativeScore) + (0.4 × contentScore)
```

### Post Filtering
- **Exclusions**: Posts user has already interacted with
- **Inclusions**: All other available posts

### Ranking & Selection
1. Sort posts by final score (descending)
2. Limit to requested number of recommendations
3. Filter out null/invalid posts

## 4. Performance Optimization

### Caching Strategy
The system implements multi-level caching:

```java
@Cacheable(value = "recommendations", key = "#userId + '_' + #numberOfRecommendations")
@Cacheable(value = "userInteractionMatrix", key = "'all_users'")
@Cacheable(value = "userPreferences", key = "'all_preferences'")  
@Cacheable(value = "postFeatures", key = "'all_posts'")
```

### Cache Invalidation
- **Automatic**: Every hour via `@Scheduled(fixedRate = 3600000)`
- **Manual**: `@CacheEvict` for all caches

### Batch Precomputation
- **Frequency**: Every 30 minutes via `@Scheduled(fixedRate = 1800000)`
- **Storage**: In-memory `ConcurrentHashMap<Long, List<Post>>`
- **Fallback**: Real-time computation if precomputed data unavailable

## 5. Data Flow

### Real-time Request Flow
1. User requests recommendations
2. Check precomputed cache
3. If cache miss → compute real-time
4. Apply collaborative filtering
5. Apply content-based filtering  
6. Combine scores with weights
7. Rank and return top N posts

### Batch Processing Flow
1. Scheduled task triggers every 30 minutes
2. Fetch all users from database
3. For each user:
   - Generate 20 recommendations
   - Store in memory cache
   - Handle errors gracefully
4. Log completion statistics

## 6. Algorithm Characteristics

### Strengths
1. **Cold Start Mitigation**: Content-based component helps new users
2. **Diversity**: Hybrid approach balances popularity and personalization
3. **Scalability**: Parallel processing and caching improve performance
4. **Robust Error Handling**: Graceful degradation with null checks

### Limitations
1. **Memory Usage**: In-memory caching of all recommendations
2. **Cold Start**: Still challenging for users with no interactions
3. **Popularity Bias**: Collaborative filtering may favor popular posts
4. **Content Dependency**: Relies heavily on categories and hashtags

## 7. Configuration Parameters

### Tunable Parameters
```java
// Algorithm weights
collaborativeWeight = 0.6
contentWeight = 0.4

// Reaction weights  
like = 1, support = 2, comment = 3, bookmark = 4

// Batch processing
precomputationInterval = 30 minutes
defaultRecommendationCount = 20

// Cache management
cacheEvictionInterval = 1 hour
```

### Performance Settings
- **Parallel Processing**: Enabled for similarity calculations
- **Cache Size**: Unlimited (relies on memory management)
- **Batch Size**: All users processed in single batch

## 8. Monitoring & Logging

### Key Metrics Logged
- User processing success/failure rates
- Recommendation generation time
- Cache hit/miss ratios  
- Error frequencies and types

### Performance Monitoring
- Batch job execution times
- Real-time computation latency
- Memory usage for cached recommendations

## 9. Future Enhancements

### Potential Improvements
1. **Machine Learning Integration**: Deep learning models for better similarity
2. **Temporal Dynamics**: Time-based decay for aging interactions
3. **Social Features**: Friend-based collaborative filtering
4. **A/B Testing**: Framework for algorithm experimentation
5. **Explicit Feedback**: User ratings to improve accuracy
6. **Cross-domain Recommendations**: Based on user profile data

### Scalability Considerations
1. **Distributed Caching**: Redis/Hazelcast for large-scale deployment
2. **Database Optimization**: Indexed queries for reaction patterns
3. **Microservice Architecture**: Separate recommendation service
4. **Stream Processing**: Real-time updates via Kafka/RabbitMQ

---

**Algorithm Version**: 1.0  
**Last Updated**: June 19, 2025  
**Performance**: Optimized for medium-scale deployments (< 100K users)
