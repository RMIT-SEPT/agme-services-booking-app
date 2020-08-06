package com.rmit.sept.lemonfruits.majorproject.entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "admins")
@Entity
public class AdminEntity extends UserEntity{

    private Integer adminId;


}
