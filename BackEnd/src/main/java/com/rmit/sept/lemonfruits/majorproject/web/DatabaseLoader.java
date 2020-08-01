package com.rmit.sept.lemonfruits.majorproject.web;

import com.rmit.sept.lemonfruits.majorproject.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

// Allows us to preload some data into the application.

@Component
public class DatabaseLoader implements CommandLineRunner {

    private final UserRepository repository;

    @Autowired
    public DatabaseLoader(UserRepository repository) {
        this.repository = repository;
    }

    /* Add 5 dummy users to application */

    @Override
    public void run(String... strings) throws Exception {
        this.repository.save(new User("tcannons42", "Tom", "Cruise", "0439995032", "The Internet", "baskd1293u190238sad"));
        this.repository.save(new User("lemonfruit6", "Tom", "Cruise", "0439995032", "The Internet", "baskd1293u190238sad"));
        this.repository.save(new User("bladewalker1", "Tom", "Cruise", "0439995032", "The Internet", "baskd1293u190238sad"));
        this.repository.save(new User("frog38", "Tom", "Cruise", "0439995032", "The Internet", "baskd1293u190238sad"));
        this.repository.save(new User("iloveuni2", "Tom", "Cruise", "0439995032", "The Internet", "baskd1293u190238sad"));
    }

}


