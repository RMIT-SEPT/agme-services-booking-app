package com.rmit.sept.lemonfruits.majorproject.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HoursRequest {

    private LocalDateTime startTime;

    private LocalDateTime endTime;

}
