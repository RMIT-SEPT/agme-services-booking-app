package com.rmit.sept.lemonfruits.majorproject.service;

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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class AdminService {

    private WorkerRepository workerRepository;

    private BookingRepository bookingRepository;

    private PasswordEncoder passwordEncoder;

    private BusinessHoursRepository businessHoursRepository;

    private WorkingHoursRepository workingHoursRepository;

    public AdminEntity getProfile(AdminEntity adminEntity) {
        return adminEntity;
    }

    public List<WorkerEntity> seeWorkers() {
        return workerRepository.findAll();
    }

    public WorkerEntity createWorker(WorkerEntity workerEntity) {
        if (workerEntity.getId() != null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id cannot be set");

        if (workerRepository.getByUsername(workerEntity.getUsername()).isPresent())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is already taken");

        if (workerEntity.getRole() == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role is not set");

        workerEntity.setPassword(passwordEncoder.encode(workerEntity.getPassword()));
        workerRepository.save(workerEntity);

        return workerEntity;
    }


    public void editWorker(Long workerId, WorkerChangeRequest request) {
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

    public void deleteWorker(Long workerId) {
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

    public Set<WorkingHoursEntity> seeWorkerHours(Long workerId) {
        WorkerEntity workerEntity = workerRepository.getOne(workerId);

        if (workerEntity == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Worker does not exist");

        return workerEntity.getWorkingHours();
    }

    public void makeBooking(BookingRequest bookingRequest) {
        if (bookingRequest.getEndTime().isBefore(bookingRequest.getStartTime()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End time must be after start time");

        WorkerEntity workerEntity = workerRepository.findById(bookingRequest.getWorkerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Worker not found"));

        WorkingHoursEntity workingHoursEntity = workingHoursRepository.isThereOverlapingEntry(bookingRequest.getStartTime(), bookingRequest.getEndTime(), workerEntity);
        if (workingHoursEntity == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Outside workers hours");

        if (bookingRequest.getEndTime().isAfter(workingHoursEntity.getEndTime()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Outside workers hours");

        if (bookingRequest.getStartTime().isBefore(workingHoursEntity.getStartTime()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Outside workers hours");

        if (!bookingRepository.getOverlapingBookingsWithWorker(
                bookingRequest.getStartTime(),
                bookingRequest.getEndTime(),
                workerEntity
        ).isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Worker is not available");

        BookingEntity newEntry = BookingEntity
                .builder()
                .workerEntity(workerEntity)
                .endTime(bookingRequest.getEndTime())
                .startTime(bookingRequest.getStartTime())
                .build();

        bookingRepository.save(newEntry);
    }

    public void assignWorkerToBooking(Long bookingId, Long workerId) {
        BookingEntity bookingEntity = bookingRepository.getOne(bookingId);

        WorkerEntity workerEntity = workerRepository.findById(workerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Worker not found"));

        if (bookingEntity == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Could not find booking");

        if (!bookingRepository.getOverlapingBookingsWithWorker(
                bookingEntity.getStartTime(),
                bookingEntity.getEndTime(),
                workerEntity
        ).isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Worker is not available");

        bookingEntity.setWorkerEntity(workerEntity);
        bookingRepository.save(bookingEntity);
    }

    public List<BookingEntity> seeBookings() {
        return bookingRepository.findAll()
                .stream()
                .filter(b -> b.getEndTime().isAfter(LocalDateTime.now()))
                .collect(Collectors.toList());
    }

    public List<BookingEntity> seeBookingHistory() {
        return bookingRepository.findAll()
                .stream()
                .filter(b -> b.getEndTime().isBefore(LocalDateTime.now()))
                .collect(Collectors.toList());
    }

    public void deleteBooking(Long bookingId) {
        BookingEntity bookingEntity = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        bookingRepository.delete(bookingEntity);
    }

    public List<BusinessHoursEntity> getBusinessHours() {
        return businessHoursRepository.findAll().stream()
                .filter(b -> b.getEndTime().isAfter(LocalDateTime.now()))
                .collect(Collectors.toList());
    }

    public void setBusinessHours(BusinessHoursRequest businessHoursRequest) {
        if (!businessHoursRepository.isThereOverlapingEntry(businessHoursRequest.getStartTime(), businessHoursRequest.getEndTime()).isEmpty())
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Overlapping entry already made");

        if (businessHoursRequest.getEndTime().isBefore(businessHoursRequest.getStartTime()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End time must be after start time");

        if (businessHoursRequest.getEndTime().isBefore(LocalDateTime.now()) | businessHoursRequest.getStartTime().isBefore(LocalDateTime.now()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only future opening hours can be set");

        BusinessHoursEntity newEntry = BusinessHoursEntity
                .builder()
                .endTime(businessHoursRequest.getEndTime())
                .startTime(businessHoursRequest.getStartTime())
                .build();

        businessHoursRepository.save(newEntry);
    }

    public void deleteBusinessHours(Long businessHoursId) {
        Optional<BusinessHoursEntity> businessHoursEntity = businessHoursRepository.findById(businessHoursId);

        if (!businessHoursEntity.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Entry not found");

        if (businessHoursEntity.get().getEndTime().isBefore(LocalDateTime.now()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot delete past entry");

        List<BookingEntity> overlappingEntities = bookingRepository.getOverlapingBookings(businessHoursEntity.get().getStartTime(), businessHoursEntity.get().getEndTime());

        if (!overlappingEntities.isEmpty())
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bookings exist in those hours: " + Arrays.toString(overlappingEntities.stream().mapToLong(BookingEntity::getBookingId).toArray()));

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
