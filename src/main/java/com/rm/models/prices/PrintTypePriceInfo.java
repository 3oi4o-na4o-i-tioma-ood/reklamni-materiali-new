package com.rm.models.prices;

import java.util.List;

public record PrintTypePriceInfo(PrintType printType, List<PriceForAmount> amounts) {}
