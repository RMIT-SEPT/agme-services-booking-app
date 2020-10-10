package com.rmit.sept.lemonfruits.majorproject.controller;

import com.rmit.sept.lemonfruits.majorproject.entity.BookingEntity;
import com.rmit.sept.lemonfruits.majorproject.entity.CustomerEntity;
import com.rmit.sept.lemonfruits.majorproject.model.ProfileChangeRequest;
import com.rmit.sept.lemonfruits.majorproject.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

import static org.springframework.http.ResponseEntity.ok;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/customer")
public class CustomerController {

    private CustomerService customerService;

    @GetMapping(value = "/availabilities", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BookingEntity>> viewAvailableBookings() {
        return ok(customerService.viewAvailableBookings());
    }

    @GetMapping(value = "/booking/{bookingId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<BookingEntity> makeBooking(@AuthenticationPrincipal CustomerEntity customerEntity, @PathVariable Long bookingId) {
        return ok(customerService.makeBooking(customerEntity, bookingId));
    }

    @DeleteMapping(value = "/booking/{bookingId}")
    public void deleteBooking(@AuthenticationPrincipal CustomerEntity customerEntity, @PathVariable Long bookingId) {
        deleteBooking(customerEntity, bookingId);
    }

    @GetMapping(value = "/view", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BookingEntity>> viewBookings(@AuthenticationPrincipal CustomerEntity customerEntity) {
        return ok(customerService.viewBookings(customerEntity));
    }

    @GetMapping(value = "/view/past", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BookingEntity>> viewPastBookings(@AuthenticationPrincipal CustomerEntity customerEntity) {
        return ok(customerService.viewPastBookings(customerEntity));
    }

    @GetMapping(value = "/profile", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CustomerEntity> viewProfile(@AuthenticationPrincipal CustomerEntity customerEntity) {
        return ok(customerEntity);
    }

    @PostMapping(value = "/profile/edit")
    public void editProfile(@AuthenticationPrincipal CustomerEntity customerEntity, @RequestBody ProfileChangeRequest request) {
        customerService.editProfile(customerEntity, request);
    }

    @PostMapping("/signup")
    public void signUpCustomer(@Valid @RequestBody CustomerEntity userEntity) {
        customerService.signUpCustomer(userEntity);
    }

    @Autowired
    public void setCustomerService(CustomerService customerService) {
        this.customerService = customerService;
    }
}
