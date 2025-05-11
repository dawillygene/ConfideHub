package com.dawillygene.ConfideHub.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;


    @PostMapping("/register")
    public Users register(@RequestBody Users user){
        return userService.registerUser(user);
    }



//    public ResponseEntity<AuthResponse> register(@Valid @RequestBody User user) {
//
//        User newUser = userService.registerUser(user);
//    String token = "this is your token";
//        return ResponseEntity.status(HttpStatus.CREATED)
//                .body(new AuthResponse(newUser, token, null, true));
//    }

    @PostMapping("/login")
    public String login(@RequestBody Users users){
        return userService.verify(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Users> getUserById(@PathVariable Long id) {
        Users users = (Users) userService.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(users);
    }

    // Response class for registration
    public static class AuthResponse {
        private Users users;
        private String token;
        private String error;
        private boolean success;

        public AuthResponse(Users users, String token, String error, boolean success) {
            this.users = users;
            this.token = token;
            this.error = error;
            this.success = success;
        }

        public Users getUser() {
            return users;
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