package com.zetsubou_0.aem.training.sling.model;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;

import javax.inject.Inject;
import javax.inject.Named;

@Model(adaptables = Resource.class)
public class TestModel {

    private Resource resource;

    @Inject
    @Optional
    @Named("sling:resourceType")
    private String type;


    public String getType() {
        return type;
    }
}
