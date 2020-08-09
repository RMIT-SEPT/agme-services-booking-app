package com.rmit.sept.lemonfruits.majorproject.controller;

import com.rmit.sept.lemonfruits.majorproject.entity.CustomerEntity;
import com.rmit.sept.lemonfruits.majorproject.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Arrays;

@RestController
@RequestMapping("/api/v1/customer")
public class CustomerController {

    private CustomerRepository customerRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @GetMapping("/availabilities")
    public void viewAvailableBookings() {

    }

    @PostMapping("/view")
    public void viewBookings() {

    }

    @PostMapping("/view/past")
    public void viewPastBookings() {

    }

    @PostMapping("/profile")
    public void viewProfile() {

    }

    @PostMapping("/profile/edit")
    public void editProfile() {

    }

    @PostMapping("/signup")
    public void signUpCustomer(@Valid @RequestBody CustomerEntity userEntity) {
        userEntity.setRoles(Arrays.asList("ROLE_USER"));
        userEntity.setPassword(passwordEncoder.encode(userEntity.getPassword()));
        customerRepository.save(userEntity);
    }


    @Autowired
    public void setCustomerRepository(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }
}
