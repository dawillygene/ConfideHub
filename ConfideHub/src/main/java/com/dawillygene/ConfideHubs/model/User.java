package com.dawillygene.ConfideHubs.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email")
        })
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 20)
    private String username;

    @Size(max = 50)
    private String anonymousUsername;

    @Column(nullable = true)
    private LocalDateTime anonymousUsernameExpiresAt;

    @NotBlank
    @Size(max = 50)
    private String email;

    @NotBlank
    @Size(max = 150)
    private String password;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    // Additional profile fields
    @Size(max = 100)
    private String fullname;

    @Size(max = 20)
    private String phone;

    @Size(max = 100)
    private String location;

    @Size(max = 200)
    private String website;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> interests = new HashSet<>();

    // Social media profiles
    @Size(max = 50)
    private String twitter;

    @Size(max = 50)
    private String linkedin;

    @Size(max = 50)
    private String github;

    @Size(max = 50)
    private String instagram;

    // Privacy settings
    private boolean privacyEmail = true;
    private boolean privacyPhone = false;
    private boolean privacyPosts = true;

    // Notification settings
    private boolean notifyPosts = true;
    private boolean notifyMessages = true;
    private boolean notifyFollowers = true;
    private boolean notifyNews = false;

    // Profile picture URL
    @Size(max = 255)
    private String profilePictureUrl;

    // Profile completion percentage
    private int profileCompletionPercentage = 0;

    public User() {
    }

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAnonymousUsername() {
        return anonymousUsername;
    }

    public void setAnonymousUsername(String anonymousUsername) {
        this.anonymousUsername = anonymousUsername;
    }

    public LocalDateTime getAnonymousUsernameExpiresAt() {
        return anonymousUsernameExpiresAt;
    }

    public void setAnonymousUsernameExpiresAt(LocalDateTime anonymousUsernameExpiresAt) {
        this.anonymousUsernameExpiresAt = anonymousUsernameExpiresAt;
    }

    /**
     * Gets the display username - returns anonymousUsername if available, otherwise regular username
     * @return the username to display publicly
     */
    public String getDisplayUsername() {
        if (anonymousUsername != null && (anonymousUsernameExpiresAt == null || LocalDateTime.now().isBefore(anonymousUsernameExpiresAt))) {
            return anonymousUsername;
        }
        return username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public Set<String> getInterests() {
        return interests;
    }

    public void setInterests(Set<String> interests) {
        this.interests = interests;
    }

    public String getTwitter() {
        return twitter;
    }

    public void setTwitter(String twitter) {
        this.twitter = twitter;
    }

    public String getLinkedin() {
        return linkedin;
    }

    public void setLinkedin(String linkedin) {
        this.linkedin = linkedin;
    }

    public String getGithub() {
        return github;
    }

    public void setGithub(String github) {
        this.github = github;
    }

    public String getInstagram() {
        return instagram;
    }

    public void setInstagram(String instagram) {
        this.instagram = instagram;
    }

    public boolean isPrivacyEmail() {
        return privacyEmail;
    }

    public void setPrivacyEmail(boolean privacyEmail) {
        this.privacyEmail = privacyEmail;
    }

    public boolean isPrivacyPhone() {
        return privacyPhone;
    }

    public void setPrivacyPhone(boolean privacyPhone) {
        this.privacyPhone = privacyPhone;
    }

    public boolean isPrivacyPosts() {
        return privacyPosts;
    }

    public void setPrivacyPosts(boolean privacyPosts) {
        this.privacyPosts = privacyPosts;
    }

    public boolean isNotifyPosts() {
        return notifyPosts;
    }

    public void setNotifyPosts(boolean notifyPosts) {
        this.notifyPosts = notifyPosts;
    }

    public boolean isNotifyMessages() {
        return notifyMessages;
    }

    public void setNotifyMessages(boolean notifyMessages) {
        this.notifyMessages = notifyMessages;
    }

    public boolean isNotifyFollowers() {
        return notifyFollowers;
    }

    public void setNotifyFollowers(boolean notifyFollowers) {
        this.notifyFollowers = notifyFollowers;
    }

    public boolean isNotifyNews() {
        return notifyNews;
    }

    public void setNotifyNews(boolean notifyNews) {
        this.notifyNews = notifyNews;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }

    public int getProfileCompletionPercentage() {
        return profileCompletionPercentage;
    }

    public void setProfileCompletionPercentage(int profileCompletionPercentage) {
        this.profileCompletionPercentage = profileCompletionPercentage;
    }
}
