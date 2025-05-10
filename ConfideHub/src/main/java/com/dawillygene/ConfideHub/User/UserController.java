package com.dawillygene.ConfideHub.User;

import com.dawillygene.ConfideHub.Storage.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    private static final String SECRET = JwtUtil.generateBase64Secret();  // Use the method from JwtUtil

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody User user) {
        User newUser = userService.registerUser(user);
        String token = JwtUtil.generateToken(newUser.getUsername());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(newUser, token, null, true));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = (User) userService.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    // Response class for registration
    public static class AuthResponse {
        private User user;
        private String token;
        private String error;
        private boolean success;

        public AuthResponse(User user, String token, String error, boolean success) {
            this.user = user;
            this.token = token;
            this.error = error;
            this.success = success;
        }

        public User getUser() {
            return user;
        }

        public String getToken() {
            return token;
        }

        public String getError() {
            return error;
        }

        public boolean isSuccess() {
            return success;
        }
    }
}