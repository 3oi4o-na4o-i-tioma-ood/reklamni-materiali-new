package com.rm.util;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class JpaConverterJson implements AttributeConverter<Object, String> {

  private final static ObjectMapper objectMapper = new ObjectMapper();

  @Override
  public String convertToDatabaseColumn(Object meta) {
    try {
      return objectMapper.writeValueAsString(meta);
    } catch (JsonProcessingException ex) {
      return null;
      // or throw an error
    }
  }

  @Override
  public Object convertToEntityAttribute(String dbData) {
    System.out.println("Parsing JSON: " + dbData);
    try {
      Object result = objectMapper.readValue(dbData, Object.class);

      System.out.println("Parsed JSON: ");
      System.out.println(result);
      return result;
    } catch (IOException ex) {
      System.out.println("Unexpected IOEx decoding json from database: " + dbData);
      return null;
    }
  }

}
