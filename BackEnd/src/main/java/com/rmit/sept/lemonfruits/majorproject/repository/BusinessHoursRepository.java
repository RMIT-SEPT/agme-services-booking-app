package com.rmit.sept.lemonfruits.majorproject.repository;

import com.rmit.sept.lemonfruits.majorproject.entity.BusinessHoursEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface BusinessHoursRepository extends JpaRepository<BusinessHoursEntity, Long> {

    @Query("select e from BusinessHoursEntity e where e.startTime <= ?2 and e.endTime >= ?1")
    List<BusinessHoursEntity> isThereOverlapingEntry(LocalDateTime newEntryStart, LocalDateTime newEntryEnd);

    @Query("select e from BusinessHoursEntity e where e.startTime <= ?1 and ?1 <= e.endTime")
    BusinessHoursEntity getBusinessHourThatContainsTime(LocalDateTime time);
}
