package com.rmit.sept.lemonfruits.majorproject.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "working_hours")
@Entity
public class WorkingHoursEntity {

    @Id
    private Integer entryId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "worker_id")
    private WorkerEntity workerEntity;

    private LocalDateTime startTime;

    private LocalDateTime endTime;


}
