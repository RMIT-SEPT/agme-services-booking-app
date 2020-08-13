package com.rmit.sept.lemonfruits.majorproject.controller;

import com.rmit.sept.lemonfruits.majorproject.model.AuthenticationRequest;
import com.rmit.sept.lemonfruits.majorproject.provider.JwtTokenProvider;
import com.rmit.sept.lemonfruits.majorproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.http.ResponseEntity.ok;


@CrossOrigin
@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    private UserRepository userRepository;

    AuthenticationManager authenticationManager;

    JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity signin(@RequestBody AuthenticationRequest data) {
        try {
            String username = data.getUsername();
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, data.getPassword()));
            String token = jwtTokenProvider.createToken(username, userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Username " + username + "not found")).getRoles());
            Map<Object, Object> model = new HashMap<>();
            model.put("username", username);
            model.put("token", token);
            return ok(model);
        } catch (AuthenticationException e) {
            throw new BadCredentialsException("Invalid username/password supplied");
        }
    }

    @PostMapping
    public void resetPassword() {

    }

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    public void setAuthenticationManager(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Autowired
    public void setJwtTokenProvider(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }
}
