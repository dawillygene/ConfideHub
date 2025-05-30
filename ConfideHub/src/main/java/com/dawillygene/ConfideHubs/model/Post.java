package com.dawillygene.ConfideHubs.model;

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
    private LocalDateTime expiresAt;
    private Double trendingScore;

}