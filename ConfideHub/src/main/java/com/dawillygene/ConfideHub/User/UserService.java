package com.dawillygene.ConfideHub.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository repository;

    @Autowired
    private JwtService jwtService;

    private BCryptPasswordEncoder encoder =  new BCryptPasswordEncoder(12);

    @Autowired
    AuthenticationManager authenticationManager;


    public Users registerUser(Users user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return repository.save(user);
    }

    public Optional<Users> findByUsername(String username) {
        return repository.findByUsername(username);
    }

    public Optional<Object> findById(Long id) {
        return Optional.of(repository.findById(id));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Users> user = repository.findByUsername(username);
        user.orElseThrow(() -> new UsernameNotFoundException("Not found: " + username));
        return user.map(UserDetailsImpl::new).get();
    }

    public String verify(Users users) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(users.getUsername(), users.getPassword()));
        if(authentication.isAuthenticated()){
            return jwtService.generateToken(users.getUsername());
        }
        return "failure";
    }
}