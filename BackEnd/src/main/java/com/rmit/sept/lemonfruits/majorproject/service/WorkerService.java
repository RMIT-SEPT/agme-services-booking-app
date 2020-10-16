package com.rmit.sept.lemonfruits.majorproject.service;

import com.rmit.sept.lemonfruits.majorproject.entity.BookingEntity;
import com.rmit.sept.lemonfruits.majorproject.entity.BusinessHoursEntity;
import com.rmit.sept.lemonfruits.majorproject.entity.WorkerEntity;
import com.rmit.sept.lemonfruits.majorproject.entity.WorkingHoursEntity;
import com.rmit.sept.lemonfruits.majorproject.model.HoursRequest;
import com.rmit.sept.lemonfruits.majorproject.repository.BookingRepository;
import com.rmit.sept.lemonfruits.majorproject.repository.BusinessHoursRepository;
import com.rmit.sept.lemonfruits.majorproject.repository.WorkingHoursRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class WorkerService {

    private WorkingHoursRepository workingHoursRepository;

    private BookingRepository bookingRepository;

    private BusinessHoursRepository businessHoursRepository;

    public WorkerEntity viewProfile(WorkerEntity workerEntity) {
        return workerEntity;
    }

    public void createAvailability(WorkerEntity workerEntity, HoursRequest hoursRequest) {
        if (workingHoursRepository.isThereOverlapingEntry(hoursRequest.getStartTime(), hoursRequest.getEndTime(), workerEntity) != null)
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Overlapping entry already made");

        if (hoursRequest.getEndTime().isBefore(hoursRequest.getStartTime()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End time must be after start time");

        BusinessHoursEntity businessHoursEntity = businessHoursRepository.getBusinessHourThatContainsTime(hoursRequest.getStartTime());
        if (businessHoursEntity == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Outside business hours");

        if (hoursRequest.getEndTime().isAfter(businessHoursEntity.getEndTime()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Outside business hours");

        WorkingHoursEntity newEntry = WorkingHoursEntity
                .builder()
                .workerEntity(workerEntity)
                .endTime(hoursRequest.getEndTime())
                .startTime(hoursRequest.getStartTime())
                .build();

        workingHoursRepository.save(newEntry);
    }

    public void removeAvailability(WorkerEntity workerEntity, Long entryId) {
        Optional<WorkingHoursEntity> workingHoursEntity = workingHoursRepository.findById(entryId);

        if (!workingHoursEntity.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Entry not found");

        if (workingHoursEntity.get().getWorkerEntity().getId() != workerEntity.getId())
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Do not have access to entry");

        if (workingHoursEntity.get().getEndTime().isBefore(LocalDateTime.now()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot delete past entry");

        if (!bookingRepository.getOverlapingBookingsWithWorker(
                workingHoursEntity.get().getStartTime(),
                workingHoursEntity.get().getEndTime(),
                workerEntity).isEmpty())
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bookings exist during these hours");

        workingHoursRepository.delete(workingHoursEntity.get());
    }

    public List<WorkingHoursEntity> getAvailability(WorkerEntity workerEntity) {
        return workingHoursRepository.findByWorkerEntityAndStartTimeAfter(workerEntity, LocalDateTime.now());
    }

    public List<BusinessHoursEntity> getBusinessHours() {
        return businessHoursRepository.findAll().stream()
                .filter(b -> b.getEndTime().isAfter(LocalDateTime.now()))
                .collect(Collectors.toList());
    }

    public List<BookingEntity> viewBookings(WorkerEntity workerEntity) {
        return workerEntity
                .getBookings()
                .stream()
                .filter(b -> b.getEndTime().isAfter(LocalDateTime.now()))
                .collect(Collectors.toList());
    }

    public List<BookingEntity> viewBookingHistory(WorkerEntity workerEntity) {
        return workerEntity
                .getBookings()
                .stream()
                .filter(b -> b.getEndTime().isBefore(LocalDateTime.now()))
                .collect(Collectors.toList());
    }

    @Autowired
    public void setWorkingHoursRepository(WorkingHoursRepository workingHoursRepository) {
        this.workingHoursRepository = workingHoursRepository;
    }

    @Autowired
    public void setBookingRepository(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Autowired
    public void setBusinessHoursRepository(BusinessHoursRepository businessHoursRepository) {
        this.businessHoursRepository = businessHoursRepository;
    }

}
