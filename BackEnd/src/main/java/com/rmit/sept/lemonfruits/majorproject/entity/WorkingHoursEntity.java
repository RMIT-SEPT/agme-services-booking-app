package com.rmit.sept.lemonfruits.majorproject.entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Table(name = "working_hours")
@Entity
public class WorkingHoursEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long entryId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "worker_id")
    private WorkerEntity workerEntity;

    private LocalDateTime startTime;

    private LocalDateTime endTime;


}
