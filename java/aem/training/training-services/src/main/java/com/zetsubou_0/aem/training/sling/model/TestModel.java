package com.zetsubou_0.aem.training.sling.model;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;

import javax.inject.Inject;
import javax.inject.Named;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class TestModel {

    @Inject
    @Named("sling:resourceType")
    private String type;

    @Inject
    private String x;

    @Self
    private Resource resource;

//    public TestModel(Resource resource) {
//        this.resource = resource;
//    }

    public String getType() {
        return type;
    }
}
