package com.zetsubou_0.aem.training.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;
import javax.inject.Named;

@Model(adaptables = {Resource.class, Page.class})
public class ResourceModel {

    @Inject
    @Named("sling:resourceType")
    private String type;

    private Resource self;

    private Page page;

    public ResourceModel(Resource self) {
        this.self = self;
        page = self.getResourceResolver().adaptTo(PageManager.class)
                .getContainingPage(self);
    }

    public String getType() {
        return type;
    }

    public Page getPage() {
        return page;
    }
}
