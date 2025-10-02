package com.rm.models.categories;

import java.util.List;

public record PaginatedModels(int total, List<Model.FullInfo> items) {
    public PaginatedModels(List<Model.FullInfo> models, int page, int pageSize) {
        this(models.size(), models.stream().skip(page * pageSize).limit(pageSize).toList());
    }
}
