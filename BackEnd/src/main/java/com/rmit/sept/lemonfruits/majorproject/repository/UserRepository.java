package com.rmit.sept.lemonfruits.majorproject.repository;

import com.rmit.sept.lemonfruits.majorproject.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {

    UserEntity getByUsernameAndPassword(String username, String password);

}
