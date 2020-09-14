package com.rmit.sept.lemonfruits.majorproject.controller;

import com.rmit.sept.lemonfruits.majorproject.entity.AdminEntity;
import com.rmit.sept.lemonfruits.majorproject.entity.BookingEntity;
import com.rmit.sept.lemonfruits.majorproject.entity.WorkerEntity;
import com.rmit.sept.lemonfruits.majorproject.entity.WorkingHoursEntity;
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
    public void makeBooking(@AuthenticationPrincipal AdminEntity adminEntity, @PathParam("workerId") String workerId) {


    }

    @PostMapping(value = "/booking/{bookingId}/{workerId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public void assignWorkerToBooking() {

    }

    @GetMapping(value = "/bookings", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BookingEntity>> seeBookings(@AuthenticationPrincipal AdminEntity adminEntity) {
        return ok(bookingRepository.findAll()
                .stream()
                .filter(b -> b.getEndTime().isAfter(LocalDateTime.now()))
                .collect(Collectors.toList()));
    }

    @GetMapping(value = "/bookings/history", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BookingEntity>> seeBookingHistory() {
        return ok(
                bookingRepository.findAll()
                        .stream()
                        .filter(b -> b.getEndTime().isBefore(LocalDateTime.now()))
                        .collect(Collectors.toList()));
    }

    public void getOpenHours() {

    }

    public void setOpenHours() {

    }

    public void deleteOpenHours() {

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
