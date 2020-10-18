package com.rmit.sept.lemonfruits.majorproject.controller;

import com.rmit.sept.lemonfruits.majorproject.entity.*;
import com.rmit.sept.lemonfruits.majorproject.model.BookingRequest;
import com.rmit.sept.lemonfruits.majorproject.model.BusinessHoursRequest;
import com.rmit.sept.lemonfruits.majorproject.model.WorkerChangeRequest;
import com.rmit.sept.lemonfruits.majorproject.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.websocket.server.PathParam;
import java.util.List;
import java.util.Set;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private AdminService adminService;

    @GetMapping(value = "/profile", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AdminEntity> getProfile(@AuthenticationPrincipal AdminEntity adminEntity) {
        return ok(adminService.getProfile(adminEntity));
    }

    @GetMapping(value = "/workers", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<WorkerEntity>> seeWorkers(@AuthenticationPrincipal AdminEntity adminEntity) {
        return ok(adminService.seeWorkers());
    }

    @PostMapping(value = "/workers", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<WorkerEntity> createWorker(@AuthenticationPrincipal AdminEntity adminEntity, @RequestBody WorkerEntity workerEntity) {
        return ok(adminService.createWorker(workerEntity));
    }


    @PutMapping(value = "/workers/{workerId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public void editWorker(@AuthenticationPrincipal AdminEntity adminEntity, @PathVariable Long workerId, @RequestBody WorkerChangeRequest request) {
        adminService.editWorker(workerId, request);
    }

    @DeleteMapping(value = "/workers/{workerId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public void deleteWorker(@AuthenticationPrincipal AdminEntity adminEntity, @PathVariable Long workerId) {
        adminService.deleteWorker(workerId);
    }

    @GetMapping(value = "/workers/{workerId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Set<WorkingHoursEntity>> seeWorkerHours(@AuthenticationPrincipal AdminEntity adminEntity, @PathVariable Long workerId) {
        return ok(adminService.seeWorkerHours(workerId));
    }

    @PostMapping(value = "/booking", produces = MediaType.APPLICATION_JSON_VALUE)
    public void makeBooking(@AuthenticationPrincipal AdminEntity adminEntity, @Valid @RequestBody BookingRequest bookingRequest) {
        adminService.makeBooking(bookingRequest);
    }

    @GetMapping(value = "/booking/{bookingId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public void assignWorkerToBooking(@AuthenticationPrincipal AdminEntity adminEntity, @PathVariable Long bookingId, @PathParam("workerId") Long workerId) {
        adminService.assignWorkerToBooking(bookingId, workerId);
    }

    @GetMapping(value = "/bookings", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BookingEntity>> seeBookings(@AuthenticationPrincipal AdminEntity adminEntity) {
        return ok(adminService.seeBookings());
    }

    @GetMapping(value = "/bookings/history", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BookingEntity>> seeBookingHistory(@AuthenticationPrincipal AdminEntity adminEntity) {
        return ok(adminService.seeBookingHistory());
    }

    @DeleteMapping(value = "/booking/{bookingId}")
    public void deleteBooking(@AuthenticationPrincipal AdminEntity adminEntity, @PathVariable Long bookingId) {
        adminService.deleteBooking(bookingId);
    }

    @GetMapping(value = "/businesshours", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BusinessHoursEntity>> getBusinessHours(@AuthenticationPrincipal AdminEntity adminEntity) {
        return ok(adminService.getBusinessHours());
    }

    @PostMapping(value = "/businesshours", produces = MediaType.APPLICATION_JSON_VALUE)
    public void setBusinessHours(@AuthenticationPrincipal AdminEntity adminEntity, @RequestBody BusinessHoursRequest businessHoursRequest) {
        adminService.setBusinessHours(businessHoursRequest);
    }

    @DeleteMapping(value = "/businesshours/{businessHoursId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public void deleteBusinessHours(@AuthenticationPrincipal AdminEntity adminEntity, @PathVariable Long businessHoursId) {
        adminService.deleteBusinessHours(businessHoursId);
    }

    @Autowired
    public void setAdminService(AdminService adminService) {
        this.adminService = adminService;
    }
}
