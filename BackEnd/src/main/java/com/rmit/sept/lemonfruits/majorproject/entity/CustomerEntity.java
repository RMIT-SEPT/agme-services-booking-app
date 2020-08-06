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
@Table(name = "customers")
@Entity
public class CustomerEntity extends UserEntity {

    private String address;

    private String phoneNumber;

    @OneToMany
    @JoinColumn
    private List<BookingEntity> bookings;
}
