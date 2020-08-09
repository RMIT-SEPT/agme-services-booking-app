package com.rmit.sept.lemonfruits.majorproject.controller;

import com.rmit.sept.lemonfruits.majorproject.entity.CustomerEntity;
import com.rmit.sept.lemonfruits.majorproject.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/v1/customer")
public class CustomerController {

    private CustomerRepository customerRepository;

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
        customerRepository.save(userEntity);
    }


    @Autowired
    public void setCustomerRepository(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }
}
