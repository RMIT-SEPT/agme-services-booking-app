package com.rmit.sept.lemonfruits.majorproject.entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Table(name = "business_hours")
@Entity
public class BusinessHoursEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long bhEntryId;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

}
