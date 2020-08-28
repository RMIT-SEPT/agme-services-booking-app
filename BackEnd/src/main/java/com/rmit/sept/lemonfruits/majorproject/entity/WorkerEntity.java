package com.rmit.sept.lemonfruits.majorproject.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@Table(name = "workers")
@Entity
public class WorkerEntity extends UserEntity {

    private String role;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "workerEntity")
    private Set<WorkingHoursEntity> workingHours;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "workerEntity")
    private Set<BookingEntity> bookings;

}
