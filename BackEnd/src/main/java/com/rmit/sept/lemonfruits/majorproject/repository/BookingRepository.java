package com.rmit.sept.lemonfruits.majorproject.repository;

import com.rmit.sept.lemonfruits.majorproject.entity.BookingEntity;
import com.rmit.sept.lemonfruits.majorproject.entity.WorkerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<BookingEntity, Long> {

    //Get bookings that have not been assigned customer AND start time is after input time
    List<BookingEntity> findByCustomerEntityIsNullAndStartTimeAfter(LocalDateTime time);

    //Get bookings with a particular worker AND start time is after input time
    List<BookingEntity> findByWorkerEntityAndStartTimeAfter(WorkerEntity workerEntity, LocalDateTime time);

    List<BookingEntity> findByWorkerEntity(WorkerEntity workerEntity);

    @Query("select e from BookingEntity e where e.startTime <= ?2 and e.endTime >= ?1")
    List<BookingEntity> getOverlapingBookings(LocalDateTime newEntryStart, LocalDateTime newEntryEnd);


}
