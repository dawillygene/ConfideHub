package com.dawillygene.ConfideHubs.DTO;

import com.dawillygene.ConfideHubs.model.Post.ExpiryDuration;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for user post requests (create/update)
 */
@Data
public class UserPostRequestDTO {
    private String title;
    private String content;
    private List<String> categories;
    private List<String> hashtags;
    private ExpiryDuration expiryDuration;
}