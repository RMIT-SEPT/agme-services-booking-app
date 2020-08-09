package com.rmit.sept.lemonfruits.majorproject.entity;

import com.rmit.sept.lemonfruits.majorproject.converter.PasswordEncypher;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

/**
 * Main user class.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
@Entity
public abstract class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull
    private String username;

    @NotNull
    @Convert(converter = PasswordEncypher.class)
    private String password;

    @NotNull
    private String firstName;

    @NotNull
    private String lastName;

}
