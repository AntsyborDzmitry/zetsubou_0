package com.zetsubou_0.aem.training.core.models.bean;

import com.zetsubou_0.aem.training.core.models.enums.FieldType;

import java.time.LocalDateTime;
import java.time.ZoneId;

public class Field {

    private final String name;
    private final String propertyName;
    private final String resourceType;

    public Field(String name, FieldType fieldType, String id) {
        this.name = name;
        this.propertyName = id != null ? id : generatePropertyName(fieldType);
        this.resourceType = fieldType.getResourceType();
    }

    public String getName() {
        return name;
    }

    public String getPropertyName() {
        return propertyName;
    }

    public String getResourceType() {
        return resourceType;
    }

    private String generatePropertyName(FieldType fieldType) {
        return fieldType.getShortName() + LocalDateTime.now().atZone(ZoneId.systemDefault()).toEpochSecond();
    }
}
