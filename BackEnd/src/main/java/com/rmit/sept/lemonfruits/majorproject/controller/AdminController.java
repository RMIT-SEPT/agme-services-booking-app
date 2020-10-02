package com.rmit.sept.lemonfruits.majorproject.controller;

import com.rmit.sept.lemonfruits.majorproject.entity.*;
import com.rmit.sept.lemonfruits.majorproject.model.BookingRequest;
import com.rmit.sept.lemonfruits.majorproject.model.BusinessHoursRequest;
import com.rmit.sept.lemonfruits.majorproject.model.WorkerChangeRequest;
import com.rmit.sept.lemonfruits.majorproject.repository.BookingRepository;
import com.rmit.sept.lemonfruits.majorproject.repository.BusinessHoursRepository;
import com.rmit.sept.lemonfruits.majorproject.repository.WorkerRepository;
import com.rmit.sept.lemonfruits.majorproject.repository.WorkingHoursRepository;
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
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private WorkerRepository workerRepository;

    private BookingRepository bookingRepository;

    private PasswordEncoder passwordEncoder;

    private BusinessHoursRepository businessHoursRepository;

    private WorkingHoursRepository workingHoursRepository;

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
        if (workerEntity.getId() != null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id cannot be set");

        if (workerRepository.getByUsername(workerEntity.getUsername()).isPresent())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is already taken");

        if (workerEntity.getRole() == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role is not set");

        workerEntity.setPassword(passwordEncoder.encode(workerEntity.getPassword()));
        workerRepository.save(workerEntity);

        return ok(workerEntity);
    }


    @PutMapping(value = "/workers/{workerId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public void editWorker(@AuthenticationPrincipal AdminEntity adminEntity, @PathVariable Long workerId, @RequestBody WorkerChangeRequest request) {
        WorkerEntity workerEntity = workerRepository.getOne(workerId);

        if (workerEntity == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Worker not found");

        if (request.getUsername() != null) {
            if (workerRepository.getByUsername(request.getUsername()).isPresent()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already in use");
            } else {
                workerEntity.setUsername(request.getUsername());
            }
        }

        if (request.getRole() != null)
            workerEntity.setRole(request.getRole());

        if (request.getFirstName() != null)
            workerEntity.setFirstName(request.getFirstName());

        if (request.getLastName() != null)
            workerEntity.setLastName(request.getLastName());

        if (request.getPassword() != null) {
            if (!passwordEncoder.matches(request.getPassword(), workerEntity.getPassword()))
                workerEntity.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        workerRepository.save(workerEntity);
    }

    @DeleteMapping(value = "/workers/{workerId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public void deleteWorker(@AuthenticationPrincipal AdminEntity adminEntity, @PathVariable Long workerId) {
        WorkerEntity workerEntity = workerRepository.getOne(workerId);

        if (workerEntity == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Worker not found");

        for (BookingEntity b : workerEntity.getBookings()) {
            bookingRepository.delete(b);
        }

        for (WorkingHoursEntity w : workerEntity.getWorkingHours()) {
            workingHoursRepository.delete(w);
        }

        workerRepository.delete(workerEntity);
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
    public ResponseEntity<List<BusinessHoursEntity>> getBusinessHours(@AuthenticationPrincipal AdminEntity adminEntity) {
        return ok(businessHoursRepository.findAll().stream()
                .filter(b -> b.getEndTime().isAfter(LocalDateTime.now()))
                .collect(Collectors.toList())
        );
    }

    @PostMapping(value = "/businesshours", produces = MediaType.APPLICATION_JSON_VALUE)
    public void setBusinessHours(@AuthenticationPrincipal AdminEntity adminEntity, @RequestBody BusinessHoursRequest businessHoursRequest) {
        if (!businessHoursRepository.isThereOverlapingEntry(businessHoursRequest.getStartTime(), businessHoursRequest.getEndTime()).isEmpty())
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Overlapping entry already made");

        if (businessHoursRequest.getEndTime().isBefore(businessHoursRequest.getStartTime()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End time must be after start time");

        BusinessHoursEntity newEntry = BusinessHoursEntity
                .builder()
                .endTime(businessHoursRequest.getEndTime())
                .startTime(businessHoursRequest.getStartTime())
                .build();

        businessHoursRepository.save(newEntry);
    }

    @DeleteMapping(value = "/businesshours/{businessHoursId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public void deleteBusinessHours(@AuthenticationPrincipal AdminEntity adminEntity, @PathVariable Long businessHoursId) {
        Optional<BusinessHoursEntity> businessHoursEntity = businessHoursRepository.findById(businessHoursId);

        if (!businessHoursEntity.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Entry not found");

        if (businessHoursEntity.get().getEndTime().isBefore(LocalDateTime.now()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot delete past entry");

        businessHoursRepository.delete(businessHoursEntity.get());
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

    @Autowired
    public void setBusinessHoursRepository(BusinessHoursRepository businessHoursRepository) {
        this.businessHoursRepository = businessHoursRepository;
    }

    @Autowired
    public void setWorkingHoursRepository(WorkingHoursRepository workingHoursRepository) {
        this.workingHoursRepository = workingHoursRepository;
    }
}
