package com.rmit.sept.lemonfruits.majorproject.entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "bookings")
@Entity
public class BookingEntity {

    @Id
    private Integer bookingId;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    @ManyToOne
    @JoinColumn
    private WorkerEntity workerEntity;

    @ManyToOne
    @JoinColumn
    private UserEntity userEntity;
}
