package com.rmit.sept.lemonfruits.majorproject.repository;

import com.rmit.sept.lemonfruits.majorproject.entity.WorkerEntity;
import com.rmit.sept.lemonfruits.majorproject.entity.WorkingHoursEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface WorkingHoursRepository extends JpaRepository<WorkingHoursEntity, Long> {

    List<WorkingHoursEntity> findByWorkerEntityAndStartTimeAfter(WorkerEntity workerEntity, LocalDateTime localDateTime);

    @Query("select e from WorkingHoursEntity e where e.startTime <= ?2 and e.endTime >= ?1")
    List<WorkingHoursEntity> isThereOverlapingEntry(LocalDateTime newEntryStart, LocalDateTime newEntryEnd);

}
