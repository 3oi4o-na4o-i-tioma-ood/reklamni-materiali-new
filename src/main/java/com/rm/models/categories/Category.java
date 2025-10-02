package com.rm.models.categories;

import java.util.List;

public record Category(String name, String url, List<Category> children, int priority) {}
