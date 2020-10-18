package com.rmit.sept.lemonfruits.majorproject;

import com.rmit.sept.lemonfruits.majorproject.entity.*;
import com.rmit.sept.lemonfruits.majorproject.model.BookingRequest;
import com.rmit.sept.lemonfruits.majorproject.model.BusinessHoursRequest;

import java.time.LocalDateTime;
import java.util.*;

public abstract class AbstractBaseTest {

    protected AdminEntity testAdminEntity() {
        AdminEntity testAdmin = new AdminEntity();
        testAdmin.setAdminId(1);
        testAdmin.setFirstName("testFirst");
        testAdmin.setLastName("testLast");
        testAdmin.setUsername("testUser");
        testAdmin.setPassword("testPass");
        return testAdmin;
    }

    protected WorkerEntity testWorkerEntity() {
        WorkerEntity testWorker = new WorkerEntity();
        testWorker.setId(1l);
        testWorker.setUsername("testCustomer");
        testWorker.setFirstName("testFirst");
        testWorker.setLastName("testLast");
        testWorker.setRole("tester");
        testWorker.setWorkingHours(Collections.emptySet());
        testWorker.setBookings(Collections.emptySet());

        return testWorker;
    }

    protected BookingRequest testBookingRequest() {
        return BookingRequest.builder()
                .startTime(LocalDateTime.now())
                .endTime(LocalDateTime.now().plusHours(1))
                .workerId(null).build();
    }

    protected BusinessHoursRequest testBusinessHoursRequest() {
        return BusinessHoursRequest.builder()
                .startTime(LocalDateTime.now().plusHours(1))
                .endTime(LocalDateTime.now().plusHours(2))
                .build();
    }

    protected BookingEntity testBookingEntity() {
        return BookingEntity.builder()
                .customerEntity(null)
                .startTime(LocalDateTime.now())
                .endTime(LocalDateTime.now().plusHours(1))
                .workerEntity(null)
                .bookingId(1l).build();
    }

    protected List<BusinessHoursEntity> testBusinessHours() {
        ArrayList<BusinessHoursEntity> businessHoursEntitySet = new ArrayList<>();
        businessHoursEntitySet.add(testUpcomingBusinessHours());
        businessHoursEntitySet.add(
                BusinessHoursEntity
                        .builder()
                        .startTime(LocalDateTime.now().plusDays(3))
                        .endTime(LocalDateTime.now().plusDays(4))
                        .build()
        );
        businessHoursEntitySet.add(testPastBusinessHours());
        return businessHoursEntitySet;
    }

    protected BusinessHoursEntity testUpcomingBusinessHours() {
        return BusinessHoursEntity
                .builder()
                .startTime(LocalDateTime.now().plusDays(1))
                .endTime(LocalDateTime.now().plusDays(2))
                .build();
    }

    protected BusinessHoursEntity testPastBusinessHours() {
        return BusinessHoursEntity
                .builder()
                .startTime(LocalDateTime.now().minusDays(3))
                .endTime(LocalDateTime.now().minusDays(4))
                .build();
    }

    public CustomerEntity testCustomer() {
        CustomerEntity testCustomer = new CustomerEntity();
        testCustomer.setUsername("testCustomer");
        testCustomer.setFirstName("testFirst");
        testCustomer.setLastName("testLast");
        testCustomer.setPhoneNumber("000");
        testCustomer.setAddress("aaaa");
        return testCustomer;
    }

    public BookingEntity testFutureBooking() {
        return BookingEntity
                .builder()
                .startTime(LocalDateTime.now().plusDays(1))
                .endTime(LocalDateTime.now().plusDays(2))
                .build();
    }

    public BookingEntity testPastBooking() {
        return BookingEntity
                .builder()
                .startTime(LocalDateTime.now().minusDays(3))
                .endTime(LocalDateTime.now().minusDays(4))
                .build();
    }

    public Set<BookingEntity> testBookingList() {
        Set<BookingEntity> bookingEntitySet = new LinkedHashSet<>();
        bookingEntitySet.add(testFutureBooking());
        bookingEntitySet.add(
                BookingEntity
                        .builder()
                        .startTime(LocalDateTime.now().plusDays(3))
                        .endTime(LocalDateTime.now().plusDays(4))
                        .build()
        );
        bookingEntitySet.add(testPastBooking());

        return bookingEntitySet;
    }

}
