package com.rm.models.design;

import javax.swing.text.StyleConstants;

public record TextElement(Long id, Size size, Position position, String text, boolean bold, boolean italic, boolean underline, String fontFamily, double fontSize, String color, Alignment alignment, String fieldName, boolean hasChanged) implements Element {
    public enum Alignment {
        LEFT(StyleConstants.ALIGN_LEFT),
        CENTER(StyleConstants.ALIGN_CENTER),
        RIGHT(StyleConstants.ALIGN_RIGHT);

        private final int styleConstantsAlignment;

        Alignment(int styleConstantsAlignment) {
            this.styleConstantsAlignment = styleConstantsAlignment;
        }

        public int styleConstantsAlignment() {
            return styleConstantsAlignment;
        }
    }
}
