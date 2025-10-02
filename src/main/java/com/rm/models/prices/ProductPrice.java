package com.rm.models.prices;

import com.rm.util.db.ColumnName;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

public record ProductPrice(ProductType product,
                           @ColumnName("print_type") PrintType printType,
                           int amount,
                           double price) {}
