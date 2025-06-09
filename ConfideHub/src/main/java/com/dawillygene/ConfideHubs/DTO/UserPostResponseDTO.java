package com.dawillygene.ConfideHubs.DTO;

import com.dawillygene.ConfideHubs.model.Post.ExpiryDuration;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for user post responses
 */
@Data
public class UserPostResponseDTO {
    private String id;
    private String title;
    private String generatedTitle;
    private String content;
    private List<String> categories;
    private List<String> hashtags;
    private int likes;
    private int supports;
    private int comments;
    private boolean bookmarked;
    private LocalDateTime createdAt;
    private ExpiryDuration expiryDuration;
    private LocalDateTime expiresAt;
    private Double trendingScore;
    private String displayUsername;
    private boolean isExpired;
}