package com.rm;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@ComponentScan
@SpringBootApplication
public class StartWebApplication {
    public static void main(String[] args) {
        SpringApplication.run(StartWebApplication.class, args);
    }
}