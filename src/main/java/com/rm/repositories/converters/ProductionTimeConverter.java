package com.rm.repositories.converters;

import com.rm.models.carts.ProductionTime;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ProductionTimeConverter implements AttributeConverter<ProductionTime, String> {
    @Override
    public String convertToDatabaseColumn(ProductionTime attribute) {
        return attribute.name();
    }

    @Override
    public ProductionTime convertToEntityAttribute(String dbData) {
        return ProductionTime.valueOf(dbData);
    }
}
