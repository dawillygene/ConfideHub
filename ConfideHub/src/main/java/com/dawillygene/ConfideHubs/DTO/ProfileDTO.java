package com.dawillygene.ConfideHubs.DTO;

import com.dawillygene.ConfideHubs.model.User;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * DTO for transferring profile information to the client
 */
public class ProfileDTO {
    private String username;
    private String email;
    private String fullname;
    private String phone;
    private String location;
    private String website;
    private String bio;
    private Set<String> interests = new HashSet<>();
    private Set<String> roles = new HashSet<>();
    private String twitter;
    private String linkedin;
    private String github;
    private String instagram;
    private boolean privacyEmail;
    private boolean privacyPhone;
    private boolean privacyPosts;
    private boolean notifyPosts;
    private boolean notifyMessages;
    private boolean notifyFollowers;
    private boolean notifyNews;
    private String profilePictureUrl;
    private int profileCompletionPercentage;

    // Empty constructor
    public ProfileDTO() {
    }

    // Constructor from User entity
    public ProfileDTO(User user) {
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.fullname = user.getFullname();
        this.phone = user.getPhone();
        this.location = user.getLocation();
        this.website = user.getWebsite();
        this.bio = user.getBio();
        this.interests = user.getInterests();
        this.roles = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());
        this.twitter = user.getTwitter();
        this.linkedin = user.getLinkedin();
        this.github = user.getGithub();
        this.instagram = user.getInstagram();
        this.privacyEmail = user.isPrivacyEmail();
        this.privacyPhone = user.isPrivacyPhone();
        this.privacyPosts = user.isPrivacyPosts();
        this.notifyPosts = user.isNotifyPosts();
        this.notifyMessages = user.isNotifyMessages();
        this.notifyFollowers = user.isNotifyFollowers();
        this.notifyNews = user.isNotifyNews();
        this.profilePictureUrl = user.getProfilePictureUrl();
        this.profileCompletionPercentage = user.getProfileCompletionPercentage();
    }

    // Getters and setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
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
