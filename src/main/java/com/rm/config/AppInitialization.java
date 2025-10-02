package com.rm.config;

import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Component
@Primary
public class AppInitialization implements ApplicationRunner {
    @Value("${paths.images}")
    private String imagesDirectory;

    @Value("${paths.designs}")
    private String designsDirectory;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        Files.createDirectories(Path.of(imagesDirectory));
        Files.createDirectories(Path.of(designsDirectory));
    }
}
