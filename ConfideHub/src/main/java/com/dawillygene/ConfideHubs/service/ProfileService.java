package com.dawillygene.ConfideHubs.service;

import com.dawillygene.ConfideHubs.DTO.ProfileDTO;
import com.dawillygene.ConfideHubs.DTO.ProfileUpdateDTO;
import com.dawillygene.ConfideHubs.exception.ResourceNotFoundException;
import com.dawillygene.ConfideHubs.model.Role;
import com.dawillygene.ConfideHubs.model.User;
import com.dawillygene.ConfideHubs.repository.RoleRepository;
import com.dawillygene.ConfideHubs.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Get current user's profile
     * @return ProfileDTO containing user's profile information
     */
    public ProfileDTO getCurrentUserProfile() {
        User user = getCurrentUser();
        // Calculate profile completion percentage before returning
        user.setProfileCompletionPercentage(calculateProfileCompletionPercentage(user));
        userRepository.save(user);
        return new ProfileDTO(user);
    }

    /**
     * Update current user's profile
     * @param profileUpdateDTO DTO containing profile update data
     * @return Updated ProfileDTO
     */
    @Transactional
    public ProfileDTO updateProfile(ProfileUpdateDTO profileUpdateDTO) {
        User user = getCurrentUser();

        // Update basic information
        if (profileUpdateDTO.getUsername() != null && !profileUpdateDTO.getUsername().isEmpty() &&
                !profileUpdateDTO.getUsername().equals(user.getUsername())) {
            // Check if username is already taken
            if (userRepository.existsByUsername(profileUpdateDTO.getUsername())) {
                throw new RuntimeException("Username is already taken");
            }
            user.setUsername(profileUpdateDTO.getUsername());
        }

        if (profileUpdateDTO.getEmail() != null && !profileUpdateDTO.getEmail().isEmpty() &&
                !profileUpdateDTO.getEmail().equals(user.getEmail())) {
            // Check if email is already taken
            if (userRepository.existsByEmail(profileUpdateDTO.getEmail())) {
                throw new RuntimeException("Email is already taken");
            }
            user.setEmail(profileUpdateDTO.getEmail());
        }

        // Update profile fields
        if (profileUpdateDTO.getFullname() != null) {
            user.setFullname(profileUpdateDTO.getFullname());
        }

        if (profileUpdateDTO.getPhone() != null) {
            user.setPhone(profileUpdateDTO.getPhone());
        }

        if (profileUpdateDTO.getLocation() != null) {
            user.setLocation(profileUpdateDTO.getLocation());
        }

        if (profileUpdateDTO.getWebsite() != null) {
            user.setWebsite(profileUpdateDTO.getWebsite());
        }

        if (profileUpdateDTO.getBio() != null) {
            user.setBio(profileUpdateDTO.getBio());
        }

        // Update social media links
        if (profileUpdateDTO.getTwitter() != null) {
            user.setTwitter(profileUpdateDTO.getTwitter());
        }

        if (profileUpdateDTO.getLinkedin() != null) {
            user.setLinkedin(profileUpdateDTO.getLinkedin());
        }

        if (profileUpdateDTO.getGithub() != null) {
            user.setGithub(profileUpdateDTO.getGithub());
        }

        if (profileUpdateDTO.getInstagram() != null) {
            user.setInstagram(profileUpdateDTO.getInstagram());
        }

        // Update interests
        if (profileUpdateDTO.getInterests() != null && !profileUpdateDTO.getInterests().isEmpty()) {
            user.setInterests(profileUpdateDTO.getInterests());
        }

        // Update privacy settings
        user.setPrivacyEmail(profileUpdateDTO.isPrivacyEmail());
        user.setPrivacyPhone(profileUpdateDTO.isPrivacyPhone());
        user.setPrivacyPosts(profileUpdateDTO.isPrivacyPosts());

        // Update notification settings
        user.setNotifyPosts(profileUpdateDTO.isNotifyPosts());
        user.setNotifyMessages(profileUpdateDTO.isNotifyMessages());
        user.setNotifyFollowers(profileUpdateDTO.isNotifyFollowers());
        user.setNotifyNews(profileUpdateDTO.isNotifyNews());

        // Handle password change
        if (profileUpdateDTO.getCurrentPassword() != null && !profileUpdateDTO.getCurrentPassword().isEmpty() &&
                profileUpdateDTO.getNewPassword() != null && !profileUpdateDTO.getNewPassword().isEmpty() &&
                profileUpdateDTO.getConfirmPassword() != null && !profileUpdateDTO.getConfirmPassword().isEmpty()) {

            // Verify current password
            if (!passwordEncoder.matches(profileUpdateDTO.getCurrentPassword(), user.getPassword())) {
                throw new RuntimeException("Current password is incorrect");
            }

            // Verify password confirmation
            if (!profileUpdateDTO.getNewPassword().equals(profileUpdateDTO.getConfirmPassword())) {
                throw new RuntimeException("New password and confirmation do not match");
            }

            // Update password
            user.setPassword(passwordEncoder.encode(profileUpdateDTO.getNewPassword()));
        }

        // Update roles if admin
        if (isCurrentUserAdmin() && profileUpdateDTO.getRoles() != null && !profileUpdateDTO.getRoles().isEmpty()) {
            Set<Role> roles = new HashSet<>();
            profileUpdateDTO.getRoles().forEach(roleName -> {
                Role role = roleRepository.findByName(com.dawillygene.ConfideHubs.data.ERole.valueOf(roleName))
                        .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
                roles.add(role);
            });
            user.setRoles(roles);
        }

        // Calculate profile completion percentage
        user.setProfileCompletionPercentage(calculateProfileCompletionPercentage(user));

        // Save user
        User updatedUser = userRepository.save(user);
        return new ProfileDTO(updatedUser);
    }

    /**
     * Upload profile picture for current user
     * @param file MultipartFile containing the image
     * @return URL of the uploaded profile picture
     */
    public String uploadProfilePicture(MultipartFile file) throws IOException {
        User user = getCurrentUser();

        // Validate file
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to upload empty file");
        }

        if (file.getSize() > 2 * 1024 * 1024) { // 2MB
            throw new RuntimeException("File size exceeds maximum limit of 2MB");
        }

        // Get file extension
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        if (!Arrays.asList(".jpg", ".jpeg", ".png", ".gif").contains(extension.toLowerCase())) {
            throw new RuntimeException("Only JPG, PNG and GIF image formats are supported");
        }

        // Create directory if it doesn't exist
        Path uploadDir = Paths.get("uploads/profile-pictures");
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        // Generate unique filename
        String filename = user.getId() + "_" + UUID.randomUUID().toString() + extension;
        Path destinationFile = uploadDir.resolve(filename);

        // Save the file
        Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);

        // Update user profile with new picture URL
        String profilePictureUrl = "/uploads/profile-pictures/" + filename;
        user.setProfilePictureUrl(profilePictureUrl);
        userRepository.save(user);

        return profilePictureUrl;
    }

    /**
     * Delete user account
     */
    @Transactional
    public void deleteAccount() {
        User user = getCurrentUser();
        userRepository.delete(user);
    }

    /**
     * Calculate the profile completion percentage
     * @param user User to calculate completion for
     * @return Profile completion percentage (0-100)
     */
    private int calculateProfileCompletionPercentage(User user) {
        int totalFields = 10; // Total number of fields we count for completion
        int completedFields = 0;

        if (user.getUsername() != null && !user.getUsername().isEmpty()) completedFields++;
        if (user.getEmail() != null && !user.getEmail().isEmpty()) completedFields++;
        if (user.getFullname() != null && !user.getFullname().isEmpty()) completedFields++;
        if (user.getProfilePictureUrl() != null && !user.getProfilePictureUrl().isEmpty()) completedFields++;
        if (user.getBio() != null && !user.getBio().isEmpty()) completedFields++;
        if (user.getLocation() != null && !user.getLocation().isEmpty()) completedFields++;
        if (user.getPhone() != null && !user.getPhone().isEmpty()) completedFields++;
        if (user.getWebsite() != null && !user.getWebsite().isEmpty()) completedFields++;
        if (!user.getInterests().isEmpty()) completedFields++;

        // Check if any social media accounts are connected
        if ((user.getTwitter() != null && !user.getTwitter().isEmpty()) ||
            (user.getLinkedin() != null && !user.getLinkedin().isEmpty()) ||
            (user.getGithub() != null && !user.getGithub().isEmpty()) ||
            (user.getInstagram() != null && !user.getInstagram().isEmpty())) {
            completedFields++;
        }

        return (completedFields * 100) / totalFields;
    }

    /**
     * Get the current authenticated user
     * @return User entity
     */
    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }

    /**
     * Check if the current user has admin role
     * @return true if user is admin
     */
    private boolean isCurrentUserAdmin() {
        return SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));
    }
}
