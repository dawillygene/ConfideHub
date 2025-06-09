package com.dawillygene.ConfideHubs.controllers;

import com.dawillygene.ConfideHubs.payload.response.JwtResponse;
import com.dawillygene.ConfideHubs.repository.RoleRepository;
import com.dawillygene.ConfideHubs.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletResponse; // Import HttpServletResponse
import jakarta.servlet.http.Cookie;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import com.dawillygene.ConfideHubs.data.ERole;
import com.dawillygene.ConfideHubs.data.RefreshToken;
import com.dawillygene.ConfideHubs.exception.exception.SignInException;
import com.dawillygene.ConfideHubs.exception.exception.TokenRefreshException;
import com.dawillygene.ConfideHubs.model.Role;
import com.dawillygene.ConfideHubs.model.User;
import com.dawillygene.ConfideHubs.payload.request.LoginRequest;
import com.dawillygene.ConfideHubs.payload.request.SignupRequest;
import com.dawillygene.ConfideHubs.payload.request.TokenRefreshRequest;
import com.dawillygene.ConfideHubs.payload.response.MessageResponse;
import com.dawillygene.ConfideHubs.payload.response.TokenRefreshResponse;
import com.dawillygene.ConfideHubs.jwt.JwtUtils;
import com.dawillygene.ConfideHubs.service.RefreshTokenService;
import com.dawillygene.ConfideHubs.service.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails; //Added

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    RefreshTokenService refreshTokenService;

    @Value("${spring.app.jwtExpirationMs}") //added
    private int jwtExpirationMs;

    @Value("${spring.app.jwtRefreshExpirationMs}") //added
    private int jwtRefreshExpirationMs;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest, HttpServletResponse response) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                if (role.equals("admin")) {
                    Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(adminRole);
                } else {
                    Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        // Generate tokens
        String accessToken = jwtUtils.generateTokenFromUsername(user.getUsername());
        String refreshToken = refreshTokenService.createRefreshToken(user.getId()).getToken();

        // Set cookies
        CookieUtils.setHttpOnlyCookie(response, "accessToken", accessToken, jwtExpirationMs / 1000, false);
        CookieUtils.setHttpOnlyCookie(response, "refreshToken", refreshToken, jwtRefreshExpirationMs / 1000, false);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }


    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        try {
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String accessToken = jwtUtils.generateJwtToken(authentication);  //changed
            String refreshToken = refreshTokenService.createRefreshToken(userDetails.getId()).getToken(); //changed

            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            CookieUtils.setHttpOnlyCookie(response, "accessToken", accessToken, jwtExpirationMs / 1000, false);
            CookieUtils.setHttpOnlyCookie(response, "refreshToken", refreshToken, jwtRefreshExpirationMs / 1000, false);

            return ResponseEntity.ok(new JwtResponse(null, null, userDetails.getId(), userDetails.getUsername(), userDetails.getEmail(), roles)); // Changed:  Don't return tokens in body

        } catch (AuthenticationException exception) {
            throw new SignInException(exception.getMessage());
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@CookieValue("refreshToken") String requestRefreshToken, HttpServletResponse response) { //changed
        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String newAccessToken = jwtUtils.generateTokenFromUsername(user.getUsername());
                    CookieUtils.setHttpOnlyCookie(response, "accessToken", newAccessToken, jwtExpirationMs / 1000, false);
                    return ResponseEntity.ok(new TokenRefreshResponse(newAccessToken, requestRefreshToken)); // Return the new access token
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken, "Refresh token is not in database!"));
    }

    @PostMapping("/logout") //added
    public ResponseEntity<?> logoutUser(HttpServletResponse response) {
        CookieUtils.clearHttpOnlyCookie(response, "accessToken");
        CookieUtils.clearHttpOnlyCookie(response, "refreshToken");
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new MessageResponse("Logged out successfully!"));
    }
    

    @GetMapping("/user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(new MessageResponse("Unauthorized: User not authenticated.")); // Explicit 401
        }

        if (authentication.getPrincipal() instanceof UserDetails) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            return ResponseEntity.ok(new JwtResponse(null, null, userDetails.getId(), userDetails.getUsername(), userDetails.getEmail(), userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList())));
        }
        else if (authentication.getPrincipal() instanceof String){
            return ResponseEntity.ok(new MessageResponse(authentication.getPrincipal().toString()));
        }
        else{
            return ResponseEntity.status(400).body(new MessageResponse("Bad Request:  Invalid principal type."));
        }

    }


    static class CookieUtils {
        public static void setHttpOnlyCookie(HttpServletResponse response, String name, String value, int maxAge, boolean secure) {
            Cookie cookie = new Cookie(name, value);
            cookie.setHttpOnly(true);
            cookie.setMaxAge(maxAge);
            cookie.setPath("/");
            cookie.setSecure(secure);
            response.addCookie(cookie);
        }

        public static void clearHttpOnlyCookie(HttpServletResponse response, String name) {
            Cookie cookie = new Cookie(name, "");
            cookie.setHttpOnly(true);
            cookie.setMaxAge(0);
            cookie.setPath("/");
            cookie.setSecure(false);
            response.addCookie(cookie);
        }
    }
}
