package com.rm.repositories.converters;

import com.rm.models.prices.ProductType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ProductTypeConverter implements AttributeConverter<ProductType, String> {
    @Override
    public String convertToDatabaseColumn(ProductType attribute) {
        return attribute.name();
    }

    @Override
    public ProductType convertToEntityAttribute(String dbData) {
        return ProductType.valueOf(dbData);
    }
}
