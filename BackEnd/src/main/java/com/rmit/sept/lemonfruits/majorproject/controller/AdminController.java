package com.rmit.sept.lemonfruits.majorproject.controller;

import com.rmit.sept.lemonfruits.majorproject.entity.AdminEntity;
import com.rmit.sept.lemonfruits.majorproject.entity.BookingEntity;
import com.rmit.sept.lemonfruits.majorproject.entity.WorkerEntity;
import com.rmit.sept.lemonfruits.majorproject.entity.WorkingHoursEntity;
import com.rmit.sept.lemonfruits.majorproject.model.BookingRequest;
import com.rmit.sept.lemonfruits.majorproject.repository.BookingRepository;
import com.rmit.sept.lemonfruits.majorproject.repository.WorkerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.websocket.server.PathParam;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private WorkerRepository workerRepository;

    private BookingRepository bookingRepository;

    private PasswordEncoder passwordEncoder;

    @GetMapping(value = "/profile", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AdminEntity> getProfile(@AuthenticationPrincipal AdminEntity adminEntity) {
        return ok(adminEntity);
    }

    @GetMapping(value = "/workers", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<WorkerEntity>> seeWorkers(@AuthenticationPrincipal AdminEntity adminEntity) {
        return ok(workerRepository.findAll());
    }

    @PostMapping(value = "/workers", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<WorkerEntity> createWorker(@AuthenticationPrincipal AdminEntity adminEntity, @RequestBody WorkerEntity workerEntity) {
        if (adminEntity.getAdminId() != null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id cannot be set");

        if (workerRepository.getByUsername(workerEntity.getUsername()).isPresent())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is already taken");

        if (workerEntity.getRole() == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role is not set");

        workerEntity.setPassword(passwordEncoder.encode(workerEntity.getPassword()));
        workerRepository.save(workerEntity);

        return ok(workerEntity);
    }

    @GetMapping(value = "/workers/{workerId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Set<WorkingHoursEntity>> seeWorkerHours(@AuthenticationPrincipal AdminEntity adminEntity, @PathVariable Long workerId) {
        WorkerEntity workerEntity = workerRepository.getOne(workerId);

        if (workerEntity == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Worker does not exist");

        return ok(workerEntity.getWorkingHours());
    }

    @PostMapping(value = "/booking", produces = MediaType.APPLICATION_JSON_VALUE)
    public void makeBooking(@AuthenticationPrincipal AdminEntity adminEntity, @RequestBody BookingRequest bookingRequest) {
        if (bookingRequest.getEndTime().isBefore(bookingRequest.getStartTime()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End time must be after start time");

        WorkerEntity workerEntity = workerRepository.findById(bookingRequest.getWorkerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Worker not found"));

        BookingEntity newEntry = BookingEntity
                .builder()
                .workerEntity(workerEntity)
                .endTime(bookingRequest.getEndTime())
                .startTime(bookingRequest.getStartTime())
                .build();

        bookingRepository.save(newEntry);
    }

    @GetMapping(value = "/booking/{bookingId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public void assignWorkerToBooking(@AuthenticationPrincipal AdminEntity adminEntity, @PathVariable Long bookingId, @PathParam("workerId") Long workerId) {
        BookingEntity bookingEntity = bookingRepository.getOne(bookingId);

        WorkerEntity workerEntity = workerRepository.findById(workerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Worker not found"));

        if (bookingEntity == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Could not find booking");

        bookingEntity.setWorkerEntity(workerEntity);
        bookingRepository.save(bookingEntity);
    }

    @GetMapping(value = "/bookings", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BookingEntity>> seeBookings(@AuthenticationPrincipal AdminEntity adminEntity) {
        return ok(bookingRepository.findAll()
                .stream()
                .filter(b -> b.getEndTime().isAfter(LocalDateTime.now()))
                .collect(Collectors.toList()));
    }

    @GetMapping(value = "/bookings/history", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BookingEntity>> seeBookingHistory(@AuthenticationPrincipal AdminEntity adminEntity) {
        return ok(
                bookingRepository.findAll()
                        .stream()
                        .filter(b -> b.getEndTime().isBefore(LocalDateTime.now()))
                        .collect(Collectors.toList()));
    }

    @DeleteMapping(value = "/booking/{bookingId}")
    public void deleteBooking(@AuthenticationPrincipal AdminEntity adminEntity, @PathVariable Long bookingId) {
        BookingEntity bookingEntity = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        bookingRepository.delete(bookingEntity);
    }

    @GetMapping(value = "/businesshours", produces = MediaType.APPLICATION_JSON_VALUE)
    public void getBusinessHour(@AuthenticationPrincipal AdminEntity adminEntity) {

    }

    @PostMapping(value = "/businesshours", produces = MediaType.APPLICATION_JSON_VALUE)
    public void setBusinessHour(@AuthenticationPrincipal AdminEntity adminEntity) {

    }

    @DeleteMapping(value = "/businesshours/{businessHoursId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public void deleteBusinessHour(@AuthenticationPrincipal AdminEntity adminEntity) {

    }

    @Autowired
    public void setWorkerRepository(WorkerRepository workerRepository) {
        this.workerRepository = workerRepository;
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
