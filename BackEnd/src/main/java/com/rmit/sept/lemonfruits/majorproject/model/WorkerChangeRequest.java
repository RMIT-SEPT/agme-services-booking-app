package com.rmit.sept.lemonfruits.majorproject.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class WorkerChangeRequest {

    private String username;

    private String password;

    private String firstName;

    private String lastName;

    private String role;
}
