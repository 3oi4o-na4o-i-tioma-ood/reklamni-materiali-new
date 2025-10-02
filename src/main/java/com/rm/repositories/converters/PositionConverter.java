package com.rm.repositories.converters;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rm.models.design.Element;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class PositionConverter implements AttributeConverter<Element.Position, String> {

  private final static ObjectMapper objectMapper = new ObjectMapper();

  @Override
  public String convertToDatabaseColumn(Element.Position data) {
    try {
      return objectMapper.writeValueAsString(data);
    } catch (JsonProcessingException ex) {
      return null;
      // or throw an error
    }
  }

  @Override
  public Element.Position convertToEntityAttribute(String dbData) {
    try {
      return objectMapper.readValue(dbData, Element.Position.class);
    } catch (IOException ex) {
      System.out.println("Unexpected IOEx decoding json from database: " + dbData);
      return null;
    }
  }

}
