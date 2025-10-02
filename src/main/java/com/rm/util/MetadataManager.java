package com.rm.util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class MetadataManager {
    private static final String METADATA_FILENAME = "metadata.txt";

    private MetadataManager() {}

    public static Map<String, String> readMetadata(Path parentPath) throws IOException {
        try (Stream<String> lines = Files.lines(parentPath.resolve(METADATA_FILENAME))) {
            return lines
                .map(line -> line.split("="))
                .collect(Collectors.toMap(line -> line[0], line -> line[1]));
        }
    }

    public static void writeMetadata(Path directory, Map<String, String> metadata) throws IOException {
        Files.writeString(
            directory.resolve(METADATA_FILENAME),
            metadata.entrySet()
                .stream()
                .map(entry -> entry.getKey() + "=" + entry.getValue())
                .collect(Collectors.joining("\n"))
        );
    }

    public static boolean isMetadataFile(Path path) {
        return path.getFileName().toString().equals(METADATA_FILENAME);
    }
}
