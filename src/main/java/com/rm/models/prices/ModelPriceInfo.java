package com.rm.models.prices;

import java.util.List;

public record ModelPriceInfo(Double modelPrice, List<PrintTypePriceInfo> printPrices) {}
