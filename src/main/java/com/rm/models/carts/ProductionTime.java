package com.rm.models.carts;

public enum ProductionTime {
    NORMAL(1),
    FAST(1.5),
    EXPRESS(2);

    public final double markup;

    ProductionTime(double markup) {
        this.markup = markup;
    }
}
