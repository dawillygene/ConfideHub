package com.dawillygene.ConfideHubs.jwt;

import java.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import com.dawillygene.ConfideHubs.jwt.JwtUtils; // Your JwtUtils
import jakarta.servlet.http.Cookie;
import java.util.Arrays;
import java.util.Optional;

public class AuthTokenFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsService userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            logger.info("AuthTokenFilter: doFilterInternal() called for URL: {}", request.getRequestURL());
            String jwt = parseJwt(request); // Get the JWT from the cookie
            if (jwt != null) {
                logger.info("AuthTokenFilter: JWT found in cookie: {}", jwt);
                if (jwtUtils.validateJwtToken(jwt)) { // Validate the JWT
                    logger.info("AuthTokenFilter: JWT is valid");
                    String username = jwtUtils.getUsernameFromJwtToken(jwt); // Extract username

                    UserDetails userDetails = userDetailsService.loadUserByUsername(username); // Load user details
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()); // Create Authentication object
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication); // Set in SecurityContext
                    logger.info("AuthTokenFilter: Authentication set for user: {}", username);
                } else {
                    logger.warn("AuthTokenFilter: JWT is invalid");
                }
            } else {
                logger.info("AuthTokenFilter: JWT not found in cookie");
            }
        } catch (Exception e) {
            logger.error("AuthTokenFilter: Cannot set user authentication: {}", e);
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {
                    logger.info("AuthTokenFilter: Found accessToken cookie");
                    return cookie.getValue(); // Return the value of the accessToken cookie
                }
            }
        }
        return null;
    }
}
