package com.rmit.sept.lemonfruits.majorproject.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Table;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@Table(name = "admins")
@Entity
public class AdminEntity extends UserEntity {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer adminId;

}
