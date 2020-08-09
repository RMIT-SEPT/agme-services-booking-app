package com.rmit.sept.lemonfruits.majorproject.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@Table(name = "customers")
@Entity
public class CustomerEntity extends UserEntity {

    private String address;

    private String phoneNumber;

    @OneToMany
    @JoinColumn
    private List<BookingEntity> bookings;
}
