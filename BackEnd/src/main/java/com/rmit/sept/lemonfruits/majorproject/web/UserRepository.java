package com.rmit.sept.lemonfruits.majorproject.web;

import com.rmit.sept.lemonfruits.majorproject.model.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long> { }
