package com.rmit.sept.lemonfruits.majorproject.controller;

import com.rmit.sept.lemonfruits.majorproject.entity.BookingEntity;
import com.rmit.sept.lemonfruits.majorproject.entity.BusinessHoursEntity;
import com.rmit.sept.lemonfruits.majorproject.entity.WorkerEntity;
import com.rmit.sept.lemonfruits.majorproject.entity.WorkingHoursEntity;
import com.rmit.sept.lemonfruits.majorproject.model.HoursRequest;
import com.rmit.sept.lemonfruits.majorproject.service.WorkerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/api/v1/worker")
public class WorkerController {

    private WorkerService workerService;

    @GetMapping(value = "/profile", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<WorkerEntity> viewProfile(@AuthenticationPrincipal WorkerEntity workerEntity) {
        return ok(workerService.viewProfile(workerEntity));
    }

    @PostMapping(value = "/availability")
    public void createAvailability(@AuthenticationPrincipal WorkerEntity workerEntity, @RequestBody HoursRequest hoursRequest) {
        workerService.createAvailability(workerEntity, hoursRequest);
    }

    @DeleteMapping(value = "/availability/{entryId}")
    public void removeAvailability(@AuthenticationPrincipal WorkerEntity workerEntity, @PathVariable Long entryId) {
        workerService.removeAvailability(workerEntity, entryId);
    }

    @GetMapping(value = "/availability", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<WorkingHoursEntity>> getAvailability(@AuthenticationPrincipal WorkerEntity workerEntity) {
        return ok(workerService.getAvailability(workerEntity));
    }

    @GetMapping(value = "/businesshours", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BusinessHoursEntity>> getBusinessHours(@AuthenticationPrincipal WorkerEntity workerEntity) {
        return ok(workerService.getBusinessHours());
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
        return ok(workerService.viewBookingHistory(workerEntity));
    }

    @Autowired
    public void setWorkerService(WorkerService workerService) {
        this.workerService = workerService;
    }
}
