package com.dawillygene.ConfideHubs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ConfideHubApplication {

	public static void main(String[] args) {
		SpringApplication.run(ConfideHubApplication.class, args);
	}

}
