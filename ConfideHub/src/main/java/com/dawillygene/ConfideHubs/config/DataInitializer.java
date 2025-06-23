package com.dawillygene.ConfideHubs.config;

import com.dawillygene.ConfideHubs.data.ERole;
import com.dawillygene.ConfideHubs.model.Role;
import com.dawillygene.ConfideHubs.repository.RoleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Data initialization component to ensure required roles exist in the database
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
    }

    private void initializeRoles() {
        // Check if roles already exist
        if (roleRepository.count() == 0) {
            logger.info("Initializing default roles...");
            
            // Create ROLE_USER
            Role userRole = new Role();
            userRole.setName(ERole.ROLE_USER);
            roleRepository.save(userRole);
            
            // Create ROLE_ADMIN
            Role adminRole = new Role();
            adminRole.setName(ERole.ROLE_ADMIN);
            roleRepository.save(adminRole);
            
            logger.info("Default roles created successfully: ROLE_USER, ROLE_ADMIN");
        } else {
            logger.info("Roles already exist in database, skipping initialization");
        }
    }
}
