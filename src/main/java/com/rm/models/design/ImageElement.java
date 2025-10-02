package com.rm.models.design;

public record ImageElement(Long id, Size size, Position position, String name, String fieldName) implements Element {}
