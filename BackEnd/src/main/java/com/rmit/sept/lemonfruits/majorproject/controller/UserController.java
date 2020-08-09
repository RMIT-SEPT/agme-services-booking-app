package com.rmit.sept.lemonfruits.majorproject.controller;

import com.rmit.sept.lemonfruits.majorproject.entity.UserEntity;
import com.rmit.sept.lemonfruits.majorproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.constraints.NotNull;
import java.util.Optional;


@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    private UserRepository userRepository;

    @PostMapping("/login")
    public UserEntity login(@NotNull @RequestParam String username, @NotNull @RequestParam String password) {
        return Optional.ofNullable(userRepository.getByUsernameAndPassword(username, password))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User details incorrect"));
    }

    @PostMapping
    public void resetPassword() {

    }

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
