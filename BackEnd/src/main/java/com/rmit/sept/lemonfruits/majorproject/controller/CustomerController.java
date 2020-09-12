package com.rmit.sept.lemonfruits.majorproject.controller;

import com.rmit.sept.lemonfruits.majorproject.entity.BookingEntity;
import com.rmit.sept.lemonfruits.majorproject.entity.CustomerEntity;
import com.rmit.sept.lemonfruits.majorproject.model.ProfileChangeRequest;
import com.rmit.sept.lemonfruits.majorproject.repository.BookingRepository;
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
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.springframework.http.ResponseEntity.ok;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/customer")
public class CustomerController {

    private CustomerRepository customerRepository;

    private UserRepository userRepository;

    private BookingRepository bookingRepository;

    private PasswordEncoder passwordEncoder;

    @GetMapping(value = "/availabilities", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BookingEntity>> viewAvailableBookings() {
        return ok(
                bookingRepository.findByCustomerEntityIsNullAndStartTimeAfter(LocalDateTime.now())
        );
    }

    @GetMapping(value = "/booking/{bookingId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<BookingEntity> makeBooking(@AuthenticationPrincipal CustomerEntity customerEntity, @PathVariable Integer bookingId) {
        Optional<BookingEntity> bookingEntity = bookingRepository.findById(bookingId);
        bookingEntity.filter(b -> b != null && b.getCustomerEntity() == null).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        bookingEntity.get().setCustomerEntity(customerEntity);
        bookingRepository.save(bookingEntity.get());
        return ok(bookingEntity.get());
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
    public void editProfile(@AuthenticationPrincipal CustomerEntity customerEntity, @RequestBody ProfileChangeRequest request) {

        if (request.getUsername() != null) {
            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already in use");
            } else {
                customerEntity.setUsername(request.getUsername());
            }
        }

        if (request.getAddress() != null)
            customerEntity.setAddress(request.getAddress());

        if (request.getPhoneNumber() != null)
            customerEntity.setPhoneNumber(request.getPhoneNumber());

        if (request.getFirstName() != null)
            customerEntity.setFirstName(request.getFirstName());

        if (request.getLastName() != null)
            customerEntity.setLastName(request.getLastName());

        if (request.getPassword() != null) {
            if (!passwordEncoder.matches(request.getPassword(), customerEntity.getPassword()))
                customerEntity.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        customerRepository.save(customerEntity);
    }

    @PostMapping("/signup")
    public void signUpCustomer(@Valid @RequestBody CustomerEntity userEntity) {
        if(userRepository.findByUsername(userEntity.getUsername()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already exists");
        }

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

    @Autowired
    public void setBookingRepository(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Autowired
    public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
}
