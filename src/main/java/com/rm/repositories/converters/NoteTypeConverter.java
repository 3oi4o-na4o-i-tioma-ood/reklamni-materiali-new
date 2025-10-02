package com.rm.repositories.converters;

import com.rm.models.prices.NoteType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class NoteTypeConverter implements AttributeConverter<NoteType, String> {
    @Override
    public String convertToDatabaseColumn(NoteType attribute) {
        return attribute.name();
    }

    @Override
    public NoteType convertToEntityAttribute(String dbData) {
        return NoteType.valueOf(dbData);
    }
}
