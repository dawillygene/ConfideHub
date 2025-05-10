package com.dawillygene.ConfideHub.Post;

import com.dawillygene.ConfideHub.User.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    @Autowired
    private PostService postService;

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestParam("file") MultipartFile file,
                                           @RequestParam("content") String content) {
        // Assume authenticated user is passed (e.g., via SecurityContext)
        User user = getAuthenticatedUser(); // Placeholder for actual auth logic
        Post post = (Post) postService.createPost(content, file, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(post);
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts(@RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "10") int size) {
        Page<Post> posts = postService.getAllPosts(PageRequest.of(page, size));
        return ResponseEntity.ok(posts.getContent());
    }

    private User getAuthenticatedUser() {
        // Placeholder: Implement actual authentication logic
        return new User();
    }

}
