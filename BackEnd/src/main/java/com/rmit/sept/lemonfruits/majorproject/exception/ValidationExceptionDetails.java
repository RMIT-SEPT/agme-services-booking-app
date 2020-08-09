package com.rmit.sept.lemonfruits.majorproject.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ValidationExceptionDetails {
    private LocalDateTime localDateTime;

    private String message;

    private String details;
}
