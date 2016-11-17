package com.zetsubou_0.aem.training.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.List;

@Model(adaptables = Resource.class)
public class CategoryModel {

    @Inject
    @Optional
    @Named(".")
    private List<CategoryFieldModel> fields;

    public List<CategoryFieldModel> getFields() {
        return fields;
    }
}