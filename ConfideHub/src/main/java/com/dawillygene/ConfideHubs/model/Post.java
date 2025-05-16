package com.dawillygene.ConfideHubs.model;

import jakarta.persistence.*;
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

    @Column(columnDefinition = "TEXT")
    private String content;

    @ElementCollection
    private List<String> categories;

    @ElementCollection
    private List<String> hashtags;

    @Transient
    private int likes;

    @Transient
    private int supports;

    @Transient
    private int comments;

    @Transient
    private boolean bookmarked; // Ensure this field is present

    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
}