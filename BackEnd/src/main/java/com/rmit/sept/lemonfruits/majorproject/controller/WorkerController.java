package com.rmit.sept.lemonfruits.majorproject.controller;

import com.rmit.sept.lemonfruits.majorproject.entity.BookingEntity;
import com.rmit.sept.lemonfruits.majorproject.entity.WorkerEntity;
import com.rmit.sept.lemonfruits.majorproject.entity.WorkingHoursEntity;
import com.rmit.sept.lemonfruits.majorproject.model.HoursRequest;
import com.rmit.sept.lemonfruits.majorproject.repository.BookingRepository;
import com.rmit.sept.lemonfruits.majorproject.repository.WorkingHoursRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/api/v1/worker")
public class WorkerController {

    private WorkingHoursRepository workingHoursRepository;

    private BookingRepository bookingRepository;

    @GetMapping(value = "/profile", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<WorkerEntity> viewProfile(@AuthenticationPrincipal WorkerEntity workerEntity) {
        return ok(workerEntity);
    }

    @PostMapping(value = "/availability")
    public void createAvailability(@AuthenticationPrincipal WorkerEntity workerEntity, @RequestBody HoursRequest hoursRequest) {
        if (!workingHoursRepository.isThereOverlapingEntry(hoursRequest.getStartTime(), hoursRequest.getEndTime()).isEmpty())
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Overlapping entry already made");

        if (hoursRequest.getEndTime().isBefore(hoursRequest.getStartTime()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End time must be after start time");

        WorkingHoursEntity newEntry = WorkingHoursEntity
                .builder()
                .workerEntity(workerEntity)
                .endTime(hoursRequest.getEndTime())
                .startTime(hoursRequest.getStartTime())
                .build();

        workingHoursRepository.save(newEntry);
    }

    @DeleteMapping(value = "/availability/{entryId}")
    public void removeAvailability(@AuthenticationPrincipal WorkerEntity workerEntity, @PathVariable Long entryId) {
        Optional<WorkingHoursEntity> workingHoursEntity = workingHoursRepository.findById(entryId);

        if (!workingHoursEntity.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Entry not found");

        if (workingHoursEntity.get().getWorkerEntity().getId() != workerEntity.getId())
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Do not have access to entry");

        if (workingHoursEntity.get().getEndTime().isBefore(LocalDateTime.now()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot delete past entry");

        workingHoursRepository.delete(workingHoursEntity.get());
    }

    @GetMapping(value = "/availability", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<WorkingHoursEntity>> getAvailability(@AuthenticationPrincipal WorkerEntity workerEntity) {
        return ok(workingHoursRepository.findByWorkerEntityAndStartTimeAfter(workerEntity, LocalDateTime.now()));
    }

    @GetMapping(value = "/bookings", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BookingEntity>> viewBookings(@AuthenticationPrincipal WorkerEntity workerEntity) {
        return ok(
                workerEntity
                        .getBookings()
                        .stream()
                        .filter(b -> b.getEndTime().isAfter(LocalDateTime.now()))
                        .collect(Collectors.toList()));
    }

    @GetMapping("/bookings/history")
    public ResponseEntity<List<BookingEntity>> viewBookingHistory(@AuthenticationPrincipal WorkerEntity workerEntity) {
        return ok(
                workerEntity
                        .getBookings()
                        .stream()
                        .filter(b -> b.getEndTime().isBefore(LocalDateTime.now()))
                        .collect(Collectors.toList()));
    }

    @Autowired
    public void setWorkingHoursRepository(WorkingHoursRepository workingHoursRepository) {
        this.workingHoursRepository = workingHoursRepository;
    }

    @Autowired
    public void setBookingRepository(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
}
