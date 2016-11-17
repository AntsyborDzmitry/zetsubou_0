package com.zetsubou_0.aem.training.core.models;

import com.zetsubou_0.aem.training.core.models.enums.FieldType;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;

@Model(adaptables = Resource.class)
public class CategoryFieldModel {

    @Inject
    @Optional
    @Named("fieldLabel")
    private String label;

    @Inject
    @Optional
    @Named("fieldType")
    private String type;

    private String resourceType;

    private String name;

    private Resource self;

    public CategoryFieldModel(Resource self) {
        this.self = self;
    }

    public String getLabel() {
        return label;
    }

    public String getType() {
        return type;
    }

    public String getName() {
        return name;
    }

    public String getResourceType() {
        return resourceType;
    }

    @PostConstruct
    protected void init() {
        name = "./" + self.getName();
        resourceType = type != null
                ? FieldType.fromType(type).getResourceType()
                : null;
    }
}
