package com.dawillygene.ConfideHubs.controllers;

import com.dawillygene.ConfideHubs.DTO.ProfileDTO;
import com.dawillygene.ConfideHubs.DTO.ProfileUpdateDTO;
import com.dawillygene.ConfideHubs.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@PreAuthorize("isAuthenticated()")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    /**
     * Get current user's profile
     */
    @GetMapping
    public ResponseEntity<ProfileDTO> getProfile() {
        ProfileDTO profileDTO = profileService.getCurrentUserProfile();
        return ResponseEntity.ok(profileDTO);
    }

    /**
     * Update user profile
     */
    @PutMapping
    public ResponseEntity<ProfileDTO> updateProfile(@RequestBody ProfileUpdateDTO profileUpdateDTO) {
        ProfileDTO updatedProfile = profileService.updateProfile(profileUpdateDTO);
        return ResponseEntity.ok(updatedProfile);
    }

    /**
     * Upload profile picture
     */
    @PostMapping(value = "/picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        try {
            String profilePictureUrl = profileService.uploadProfilePicture(file);
            Map<String, String> response = new HashMap<>();
            response.put("url", profilePictureUrl);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to upload profile picture: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Delete user account
     */
    @DeleteMapping
    public ResponseEntity<Void> deleteAccount() {
        profileService.deleteAccount();
        return ResponseEntity.noContent().build();
    }
}
