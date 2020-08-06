package com.rmit.sept.lemonfruits.majorproject.entity;

import com.rmit.sept.lemonfruits.majorproject.converter.PasswordEncypher;
import lombok.*;

import javax.persistence.*;

/**
 * Main user class.
 *
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
@Entity
public abstract class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String username;

    @Convert(converter = PasswordEncypher.class)
    private String password;

    private String firstName;

    private String lastName;

}
