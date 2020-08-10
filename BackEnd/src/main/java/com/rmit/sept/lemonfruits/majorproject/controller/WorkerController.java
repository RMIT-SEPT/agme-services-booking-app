package com.rmit.sept.lemonfruits.majorproject.controller;

import com.rmit.sept.lemonfruits.majorproject.entity.BookingEntity;
import com.rmit.sept.lemonfruits.majorproject.entity.WorkingHoursEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/v1/worker")
public class WorkerController {

    @PostMapping("/availability")
    public void createAvailability() {

    }

    @GetMapping
    public List<WorkingHoursEntity> getAvailability() {
        return Collections.emptyList();
    }

    @PostMapping("/bookings")
    public List<BookingEntity> viewBookings() {
        return Collections.emptyList();
    }

    @PostMapping("/booking/history")
    public List<BookingEntity> viewBookingHistory() {
        return Collections.emptyList();
    }

}
