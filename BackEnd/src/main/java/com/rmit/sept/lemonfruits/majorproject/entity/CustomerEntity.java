package com.rmit.sept.lemonfruits.majorproject.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@Table(name = "customers")
@Entity
public class CustomerEntity extends UserEntity {

    private String address;

    private String phoneNumber;

    @JsonIgnore
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "customerEntity")
    private Set<BookingEntity> bookings;
}
