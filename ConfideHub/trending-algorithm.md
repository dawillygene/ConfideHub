# ConfideHub Trending Score Algorithm Documentation

## Overview

ConfideHub implements a sophisticated trending score algorithm that combines engagement metrics with time-based decay to surface the most relevant and timely content. The algorithm balances recent activity with overall engagement to create a dynamic ranking system.

## Algorithm Architecture

### Core Implementation
- **Service**: `PostService.calculateTrendingScoresAndCleanExpiredPosts()`
- **Location**: `com.dawillygene.ConfideHubs.service.PostService`
- **Execution**: Scheduled background task
- **Storage**: `trendingScore` field in Post entity

## Trending Score Formula

### Mathematical Model
```java
trendingScore = engagementScore × timeFactor
```

Where:
```java
engagementScore = (likeCount × 1) + (supportCount × 2) + (commentCount × 1.5)
timeFactor = e^(-0.00001 × ageInSeconds)
```

### Complete Formula
```java
trendingScore = [(likes × 1) + (supports × 2) + (comments × 1.5)] × e^(-0.00001 × (now - createdAt))
```

## Algorithm Components

### 1. Engagement Score Calculation

#### Weighted Reaction System
The algorithm assigns different weights to user reactions based on engagement level:

```java
// Engagement weights
likes:    1.0 (base engagement)
supports: 2.0 (higher intent engagement) 
comments: 1.5 (moderate effort engagement)
```

#### Rationale for Weights
- **Likes (1.0)**: Quick, low-effort engagement - baseline metric
- **Supports (2.0)**: Higher emotional investment - weighted more heavily
- **Comments (1.5)**: Moderate effort but indicates deeper engagement
- **Bookmarks**: Not included in trending (used for recommendations instead)

#### Engagement Score Calculation
```java
long likeCount = reactionRepository.countByPostIdAndReactionType(postId, "like");
long supportCount = reactionRepository.countByPostIdAndReactionType(postId, "support"); 
long commentCount = reactionRepository.countByPostIdAndReactionType(postId, "comment");

double engagementScore = (likeCount * 1 + supportCount * 2 + commentCount * 1.5);
```

### 2. Time-Based Decay Factor

#### Exponential Decay Model
The algorithm uses exponential decay to reduce the influence of older posts:

```java
double timeFactor = Math.exp(-0.00001 * (nowEpochSecond - createdAtEpochSecond));
```

#### Decay Characteristics
- **Decay Constant**: `λ = 0.00001` (tunable parameter)
- **Decay Type**: Exponential (natural logarithm base)
- **Time Unit**: Seconds since post creation
- **Range**: (0, 1] where 1 = newest posts, approaches 0 for very old posts

#### Time Factor Analysis
| Age | Time Factor | Effective Weight |
|-----|-------------|------------------|
| 0 seconds | 1.000 | 100% |
| 1 hour | 0.964 | 96.4% |
| 1 day | 0.414 | 41.4% |
| 1 week | 0.004 | 0.4% |
| 1 month | ~0.000 | ~0% |

### 3. Time Calculation Implementation

#### Epoch Time Conversion
```java
java.time.ZoneOffset currentOffset = java.time.OffsetDateTime.now().getOffset();
long nowEpochSecond = now.toEpochSecond(currentOffset);
long createdAtEpochSecond = post.getCreatedAt().toEpochSecond(currentOffset);
long ageInSeconds = nowEpochSecond - createdAtEpochSecond;
```

#### Timezone Handling
- Uses system timezone offset for consistency
- Converts LocalDateTime to epoch seconds for mathematical operations
- Ensures accurate time differences across timezone changes

## Execution Strategy

### Scheduled Processing
```java
@Async
@Scheduled(fixedRate = 3600000) // Every hour (3,600,000 milliseconds)
public void calculateTrendingScoresAndCleanExpiredPosts()
```

#### Processing Characteristics
- **Frequency**: Every 60 minutes
- **Execution**: Asynchronous background task
- **Scope**: All posts in database
- **Dual Purpose**: Score calculation + expired post cleanup

### Processing Flow
1. **Fetch All Posts**: `postRepository.findAll()`
2. **Check Expiration**: Remove expired posts first
3. **Count Reactions**: Query reaction counts by type
4. **Calculate Age**: Compute time since creation
5. **Apply Formula**: Calculate trending score
6. **Update Database**: Save new trending score
7. **Log Results**: Debug logging for monitoring

### Performance Considerations
- **Asynchronous Execution**: Non-blocking for user requests
- **Batch Processing**: Single database transaction per score update
- **Memory Efficient**: Processes posts one at a time
- **Database Load**: Read-heavy with periodic writes

## Sorting and Retrieval

### Trending Post Retrieval
```java
if ("trending".equalsIgnoreCase(sortBy)) {
    sort = Sort.by(Sort.Order.desc("trendingScore"))
            .and(Sort.by(Sort.Order.desc("createdAt")))
            .and(Sort.by(Sort.Order.asc("id")));
}
```

#### Sort Priority
1. **Primary**: Trending score (descending) - highest scores first
2. **Secondary**: Creation time (descending) - newer posts for ties
3. **Tertiary**: Post ID (ascending) - consistent ordering for identical scores

### Database Query
```sql
SELECT p FROM Post p 
WHERE p.expiresAt IS NULL OR p.expiresAt > :now 
ORDER BY p.trendingScore DESC, p.createdAt DESC, p.id ASC
```

## Algorithm Characteristics

### Strengths
1. **Recency Bias**: Favors newer content while preserving high-engagement older posts
2. **Engagement Quality**: Weights different interaction types appropriately
3. **Automatic Decay**: Self-regulating system prevents stale content dominance
4. **Performance**: Efficient batch processing with minimal real-time impact
5. **Consistency**: Deterministic scoring with reproducible results

### Limitations
1. **Cold Start**: New posts with no engagement start at 0
2. **Engagement Threshold**: Low-engagement posts may never trend
3. **Gaming Potential**: Could be manipulated with artificial engagement
4. **Memory Usage**: Requires full post scan every hour
5. **Latency**: Up to 1-hour delay for score updates

## Configuration Parameters

### Tunable Constants
```java
// Engagement weights
final double LIKE_WEIGHT = 1.0;
final double SUPPORT_WEIGHT = 2.0; 
final double COMMENT_WEIGHT = 1.5;

// Time decay
final double DECAY_CONSTANT = 0.00001;
final long UPDATE_INTERVAL = 3600000; // 1 hour in milliseconds
```

### Optimization Opportunities
- **Dynamic Weights**: Adjust based on community engagement patterns
- **Configurable Decay**: Allow different decay rates for different content types
- **Peak Hours**: Higher weights during active user periods
- **Category-Specific**: Different algorithms for different post categories

## Monitoring and Analytics

### Logged Metrics
```java
logger.debug("Calculated trending score {} for post {}", trendingScore, post.getId());
logger.info("Trending scores updated and expired posts cleaned.");
```

### Key Performance Indicators
- **Score Distribution**: Range and variance of trending scores
- **Update Performance**: Time taken for full score recalculation
- **Engagement Correlation**: Relationship between scores and actual user engagement
- **Temporal Patterns**: Score evolution over time for individual posts

### Diagnostic Queries
```sql
-- Top trending posts
SELECT id, trendingScore, createdAt, likes, supports, comments 
FROM posts 
ORDER BY trendingScore DESC 
LIMIT 10;

-- Score distribution analysis
SELECT 
    COUNT(*) as total_posts,
    AVG(trendingScore) as avg_score,
    MAX(trendingScore) as max_score,
    MIN(trendingScore) as min_score
FROM posts 
WHERE expiresAt IS NULL OR expiresAt > NOW();
```

## Integration Points

### API Endpoints
- **Trending Feed**: `/api/posts?sortBy=trending`
- **Mixed Sorting**: Supports trending, newest, and default sorting
- **Pagination**: Maintains sort order across pages

### Frontend Integration
```javascript
// Request trending posts
const response = await fetch('/api/posts?sortBy=trending&page=0&size=20');
const trendingPosts = await response.json();
```

## Future Enhancements

### Potential Improvements
1. **Machine Learning**: Predictive trending using engagement velocity
2. **Real-time Updates**: Stream processing for immediate score updates
3. **Personalized Trending**: User-specific trending based on interests
4. **Viral Detection**: Special handling for rapidly growing posts
5. **Seasonal Adjustments**: Different decay rates based on content type/category
6. **A/B Testing**: Framework for experimenting with different formulas

### Advanced Features
1. **Velocity Scoring**: Rate of engagement change over time
2. **Quality Signals**: Integration with content quality metrics
3. **Community Feedback**: Downvoting or quality reports impact
4. **Geographic Trending**: Location-based trending calculation
5. **Time-of-Day Weighting**: Boost scores during peak hours

### Scalability Considerations
1. **Incremental Updates**: Only recalculate scores for posts with new engagement
2. **Distributed Processing**: Parallel processing across multiple nodes
3. **Caching Strategy**: Cache frequently accessed trending lists
4. **Database Optimization**: Indexes on trending score and timestamp fields

---

**Algorithm Version**: 1.0  
**Last Updated**: June 19, 2025  
**Performance**: Optimized for hourly batch processing  
**Complexity**: O(n) where n = total number of posts
