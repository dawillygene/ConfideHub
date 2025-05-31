package com.dawillygene.ConfideHubs.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.persistence.FetchType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "posts")
@Data
public class Post {
    @Id
    private String id;

    private Long userId;

    @Transient
    private String displayUsername;

    private String username;

    private String title;
    private String generatedTitle;

    @Column(columnDefinition = "TEXT")
    private String content;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> categories;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> hashtags;

    private int likes;
    private int supports;
    private int comments;
    private boolean bookmarked;

    private LocalDateTime createdAt;

    // Self-destruction settings
    @Enumerated(EnumType.STRING)
    private ExpiryDuration expiryDuration = ExpiryDuration.NEVER; // Default to no expiry

    private LocalDateTime expiresAt;
    private Double trendingScore;

    public enum ExpiryDuration {
        HOURS_24("24h", 24),
        DAYS_7("7d", 168),
        NEVER("forever", -1);

        private final String displayName;
        private final int hours;

        ExpiryDuration(String displayName, int hours) {
            this.displayName = displayName;
            this.hours = hours;
        }

        public String getDisplayName() {
            return displayName;
        }

        public int getHours() {
            return hours;
        }

        public LocalDateTime calculateExpiryDate(LocalDateTime creationTime) {
            if (this == NEVER) return null;
            return creationTime.plusHours(hours);
        }
    }

    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }

    public void setExpiryDuration(ExpiryDuration duration) {
        this.expiryDuration = duration;
        if (createdAt != null) {
            this.expiresAt = duration.calculateExpiryDate(createdAt);
        }
    }

    @JsonProperty("username")
    public String getUsername() {
        if (displayUsername != null) {
            return displayUsername;
        }

        return username;
    }
}
