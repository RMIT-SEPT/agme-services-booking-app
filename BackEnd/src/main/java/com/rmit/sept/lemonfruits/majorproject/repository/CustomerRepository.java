package com.rmit.sept.lemonfruits.majorproject.repository;

import com.rmit.sept.lemonfruits.majorproject.entity.CustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<CustomerEntity, Long> {
}
