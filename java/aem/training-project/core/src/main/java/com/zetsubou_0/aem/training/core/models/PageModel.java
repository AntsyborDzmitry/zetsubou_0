package com.zetsubou_0.aem.training.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import org.apache.sling.api.resource.ModifiableValueMap;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;

import javax.annotation.PostConstruct;

@Model(adaptables = {Resource.class})
public class PageModel {

    private Resource self;

    private ModifiableValueMap properties;

    public PageModel(Resource self) {
        this.self = self;
    }

    @PostConstruct
    public void init() {
        PageManager pageManager = self.getResourceResolver().adaptTo(PageManager.class);
        Page page = pageManager.getContainingPage(self);
        properties = page.getContentResource().adaptTo(ModifiableValueMap.class);
    }

    public ValueMap getProperties() {
        return properties;
    }

    public ModifiableValueMap getModifiedProperties() {
        return properties;
    }
}
