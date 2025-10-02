package com.rm.models.prices;

import java.util.List;

public record PriceUpdateInfo(ProductType productType, int amount, List<NewPrice> prices) {
    public record NewPrice(PrintType printType, double value) {}
}
