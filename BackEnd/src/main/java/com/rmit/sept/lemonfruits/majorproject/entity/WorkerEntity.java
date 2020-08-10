package com.rmit.sept.lemonfruits.majorproject.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@Table(name = "workers")
@Entity
public class WorkerEntity extends UserEntity {

    private String role;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "workerEntity")
    private Set<WorkingHoursEntity> workingHours;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "workerEntity")
    private Set<BookingEntity> bookings;

}
