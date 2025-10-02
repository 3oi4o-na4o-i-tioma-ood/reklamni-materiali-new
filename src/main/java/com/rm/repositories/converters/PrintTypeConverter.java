package com.rm.repositories.converters;

import com.rm.models.prices.PrintType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class PrintTypeConverter implements AttributeConverter<PrintType, String> {
    @Override
    public String convertToDatabaseColumn(PrintType attribute) {
        if(attribute == null) {
            return null;
        }

        return attribute.name();
    }

    @Override
    public PrintType convertToEntityAttribute(String dbData) {
        if(dbData == null) {
            return null;
        }

        return PrintType.valueOf(dbData);
    }
}
