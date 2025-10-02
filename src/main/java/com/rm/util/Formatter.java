package com.rm.util;

import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Locale;

public class Formatter {
    private Formatter() {}

    public static final DecimalFormat PRICE_FORMAT = new DecimalFormat("#0.00");
    static {
        PRICE_FORMAT.setDecimalFormatSymbols(DecimalFormatSymbols.getInstance(Locale.of("bg", "BG")));
    }
}
