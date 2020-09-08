package com.rmit.sept.lemonfruits.majorproject.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.Collection;
import java.util.Collections;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Table(name = "workers")
@Entity
public class WorkerEntity extends UserEntity {

    private String role;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "workerEntity")
    private Set<WorkingHoursEntity> workingHours;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "workerEntity")
    private Set<BookingEntity> bookings;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("worker"));
    }
}
