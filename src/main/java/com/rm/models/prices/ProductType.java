package com.rm.models.prices;

public enum ProductType {
    BUSINESS_CARD(94, 54, 300),
    WORK_CALENDAR(336, 235, 225),
    POCKET_CALENDAR(94, 56, 300),
    FLIER_10x15(101, 154, 300),
    FLIER_10x20(101, 204, 300),
    PEN(140, 35, 300),
    LIGHTER(101, 204, 300);

    private static final double INCHES_PER_MM = 0.0393701;

    private final int imageMMWidth;
    private final int imageMMHeight;
    private final double imagePixelWidth;
    private final double imagePixelHeight;
    private final int dpi;

    ProductType(int imageRealWidthMM, int imageRealHeightMM, int dpi) {
        imageMMWidth = imageRealWidthMM;
        imageMMHeight = imageRealHeightMM;
        imagePixelWidth = imageRealWidthMM * INCHES_PER_MM * dpi;
        imagePixelHeight = imageRealHeightMM * INCHES_PER_MM * dpi;
        this.dpi = dpi;
    }

    public int imageMMWidth() {
        return imageMMWidth;
    }

    public int imageMMHeight() {
        return imageMMHeight;
    }

    public double imagePixelWidth() {
        return imagePixelWidth;
    }

    public double imagePixelHeight() {
        return imagePixelHeight;
    }

    public int dpi() {
        return dpi;
    }
}
