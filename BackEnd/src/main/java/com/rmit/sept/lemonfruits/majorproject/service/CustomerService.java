package com.rmit.sept.lemonfruits.majorproject.service;

import com.rmit.sept.lemonfruits.majorproject.entity.BookingEntity;
import com.rmit.sept.lemonfruits.majorproject.entity.CustomerEntity;
import com.rmit.sept.lemonfruits.majorproject.model.ProfileChangeRequest;
import com.rmit.sept.lemonfruits.majorproject.repository.BookingRepository;
import com.rmit.sept.lemonfruits.majorproject.repository.CustomerRepository;
import com.rmit.sept.lemonfruits.majorproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class CustomerService {

    private CustomerRepository customerRepository;

    private UserRepository userRepository;

    private BookingRepository bookingRepository;

    private PasswordEncoder passwordEncoder;

    public List<BookingEntity> viewAvailableBookings() {
        return bookingRepository.findByCustomerEntityIsNullAndStartTimeAfter(LocalDateTime.now());
    }

    public BookingEntity makeBooking(CustomerEntity customerEntity, Long bookingId) {
        Optional<BookingEntity> bookingEntity = bookingRepository.findById(bookingId);
        bookingEntity.filter(b -> b != null && b.getCustomerEntity() == null).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        bookingEntity.get().setCustomerEntity(customerEntity);
        bookingRepository.save(bookingEntity.get());
        return bookingEntity.get();
    }

    public void deleteBooking(CustomerEntity customerEntity, Long bookingId) {
        BookingEntity bookingEntity = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        if (bookingEntity.getStartTime().isAfter(LocalDateTime.now().plusDays(2))) {
            bookingEntity.setCustomerEntity(null);
            bookingRepository.save(bookingEntity);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can't cancel booking within 48 hours");
        }
    }

    public List<BookingEntity> viewBookings(CustomerEntity customerEntity) {
        return customerEntity
                .getBookings()
                .stream()
                .filter(b -> b.getEndTime().isAfter(LocalDateTime.now()))
                .collect(Collectors.toList());
    }

    public List<BookingEntity> viewPastBookings(CustomerEntity customerEntity) {
        return customerEntity
                .getBookings()
                .stream()
                .filter(b -> b.getEndTime().isBefore(LocalDateTime.now()))
                .collect(Collectors.toList());
    }

    public CustomerEntity viewProfile(CustomerEntity customerEntity) {
        return customerEntity;
    }

    public void editProfile(CustomerEntity customerEntity, ProfileChangeRequest request) {

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

    public void signUpCustomer(CustomerEntity userEntity) {
        if (userRepository.findByUsername(userEntity.getUsername()).isPresent()) {
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
