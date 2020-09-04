package com.rmit.sept.lemonfruits.majorproject.entity;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Table;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString(callSuper = true)
@Table(name = "admins")
@Entity
public class AdminEntity extends UserEntity {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer adminId;

}
