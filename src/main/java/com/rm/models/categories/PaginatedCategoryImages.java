package com.rm.models.categories;

import java.util.List;

public record PaginatedCategoryImages(int total, List<String> items) {
    public PaginatedCategoryImages(List<String> items, int page, int pageSize) {
        this(items.size(), items.stream().skip(page * pageSize).limit(pageSize).toList());
    }
}
