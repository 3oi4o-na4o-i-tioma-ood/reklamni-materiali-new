package com.rm.models.design;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.rm.repositories.converters.PositionConverter;
import com.rm.repositories.converters.SizeConverter;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
    @JsonSubTypes.Type(value = ImageElement.class, name = "image"),
    @JsonSubTypes.Type(value = TextElement.class, name = "text"),
})
public sealed interface Element permits ImageElement, TextElement {
    Long id();

    record Position(double x, double y) {}
    record Size(double w, double h) {}

    public static Raw createRaw(Element element, DesignSide.Raw designSide) {
        Raw resultElement;

        switch(element) {
            case ImageElement(Long id, Size size, Position position, String name, String fieldName) -> {
                ImageRaw img = new ImageRaw();
                img.id = id;
                img.type = "image";
                img.position = position;
                img.size = size;
                img.name = name;
                img.fieldName = fieldName;
                resultElement = img;
            }
            case TextElement(Long id, Size size, Position position, String text, boolean bold, boolean italic, boolean underline, String fontFamily, double fontSize, String color, TextElement.Alignment alignment, String fieldName, boolean hasChanged) -> {
                TextRaw textRaw = new TextRaw();
                textRaw.id = id;
                textRaw.type = "text";
                textRaw.position = position;
                textRaw.size = size;

                textRaw.text = text;
                textRaw.bold = bold;
                textRaw.italic = italic;
                textRaw.underline = underline;
                textRaw.fontFamily = fontFamily;
                textRaw.fontSize = fontSize;
                textRaw.color = color;
                textRaw.alignment = alignment;
                textRaw.fieldName = fieldName;
                textRaw.hasChanged = hasChanged;
                resultElement = textRaw;
            }
        }

        // Reuse the same DesignSide.Raw instance to avoid multiple detached instances
        // with the same id in the persistence context
        resultElement.designSide = designSide;
        
        return resultElement;
    }

    @Entity(name = "Elements")
    @Table(name = "Elements")
    public class Raw {
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Id
        public Long id;
        public String type;

        @Convert(converter = PositionConverter.class)
        public Position position;

        @Convert(converter = SizeConverter.class)
        public Size size;

        public String fieldName;

        @ManyToOne(cascade = CascadeType.ALL)
        @JoinColumn(name = "design_side_id")
        @JsonBackReference
        public DesignSide.Raw designSide;

        
        
        public Raw() {

        }

        public Raw(Element element, DesignSide.Raw designSide) {
            
        }
    }

    public class ImageRaw extends Raw {
        public String name;

        public ImageRaw() {
            this.type = "image";
        }
    }

    public class TextRaw extends Raw {
        public String text;
        public boolean bold;
        public boolean italic;
        public boolean underline;
        public String fontFamily;
        public double fontSize;
        public String color;
        public TextElement.Alignment alignment;
        public boolean hasChanged;

        public TextRaw() {
            this.type = "text";
        }
    }
}