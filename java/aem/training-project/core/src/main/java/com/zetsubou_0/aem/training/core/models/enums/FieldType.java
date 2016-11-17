package com.zetsubou_0.aem.training.core.models.enums;

public enum FieldType {

    TEXT("/libs/granite/ui/components/foundation/form/textfield"),
    DATE("/libs/granite/ui/components/foundation/form/datepicker"),
    PATH("/libs/granite/ui/components/foundation/form/pathbrowser");

    private final String resourceType;

    FieldType(String resourceType) {
        this.resourceType = resourceType;
    }

    public static FieldType fromType(String name) {
        return FieldType.valueOf(name.toUpperCase());
    }

    public String getResourceType() {
        return resourceType;
    }

    public String getShortName() {
        return this.toString().toLowerCase();
    }
}
