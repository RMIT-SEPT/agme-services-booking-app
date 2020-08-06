package com.rmit.sept.lemonfruits.majorproject.entity;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "workers")
@Entity
public class WorkerEntity extends UserEntity{

    private String role;

    @OneToMany
    @JoinColumn
    private List<WorkingHoursEntity> workingHours;

    @OneToMany
    @JoinColumn
    private List<BookingEntity> bookings;

}
