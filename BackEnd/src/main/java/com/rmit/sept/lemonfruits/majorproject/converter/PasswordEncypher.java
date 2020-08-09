package com.rmit.sept.lemonfruits.majorproject.converter;

import javax.persistence.AttributeConverter;

public class PasswordEncypher implements AttributeConverter<String, String> {

    @Override
    public String convertToDatabaseColumn(String s) {
        return s;
    }

    @Override
    public String convertToEntityAttribute(String s) {
        return s;
    }
}
