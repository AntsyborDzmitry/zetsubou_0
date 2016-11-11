package com.zetsubou_0.aem.training.core.models;

import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;
import javax.inject.Named;

@Model(adaptables = Resource.class)
public class PageModel {

    @Inject
    @Named("jcr:title")
    private String title;

    private Resource self;

    public PageModel(Resource self) {
        this.self = self;
    }

    public String getTitle() {
        return title;
    }

    public Page getPage() {
        return self.getParent().adaptTo(Page.class);
    }
}
