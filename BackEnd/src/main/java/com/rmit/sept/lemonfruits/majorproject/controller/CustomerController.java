package com.rmit.sept.lemonfruits.majorproject.controller;

import com.rmit.sept.lemonfruits.majorproject.entity.BookingEntity;
import com.rmit.sept.lemonfruits.majorproject.entity.CustomerEntity;
import com.rmit.sept.lemonfruits.majorproject.repository.CustomerRepository;
import com.rmit.sept.lemonfruits.majorproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/api/v1/customer")
public class CustomerController {

    private CustomerRepository customerRepository;

    private UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @GetMapping(value = "/availabilities", produces = MediaType.APPLICATION_JSON_VALUE)
    public void viewAvailableBookings() {

    }

    @GetMapping(value = "/view", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BookingEntity>> viewBookings(@AuthenticationPrincipal CustomerEntity customerEntity) {
        return ok(
                customerEntity
                        .getBookings()
                        .stream()
                        .filter(b -> b.getEndTime().isAfter(LocalDateTime.now()))
                        .collect(Collectors.toList()));
    }

    @GetMapping(value = "/view/past", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BookingEntity>> viewPastBookings(@AuthenticationPrincipal CustomerEntity customerEntity) {
        return ok(
                customerEntity
                        .getBookings()
                        .stream()
                        .filter(b -> b.getEndTime().isBefore(LocalDateTime.now()))
                        .collect(Collectors.toList()));
    }

    @GetMapping(value = "/profile", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CustomerEntity> viewProfile(@AuthenticationPrincipal CustomerEntity customerEntity) {
        return ok(customerEntity);
    }

    @PostMapping(value = "/profile/edit")
    public void editProfile() {

    }

    @PostMapping("/signup")
    public void signUpCustomer(@Valid @RequestBody CustomerEntity userEntity) {
        if(userRepository.findByUsername(userEntity.getUsername()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already exists");
        }

        userEntity.setRoles(Arrays.asList("CUSTOMER"));
        userEntity.setPassword(passwordEncoder.encode(userEntity.getPassword()));
        customerRepository.save(userEntity);
    }


    @Autowired
    public void setCustomerRepository(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
