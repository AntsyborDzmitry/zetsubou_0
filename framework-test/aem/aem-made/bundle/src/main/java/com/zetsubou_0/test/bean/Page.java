package com.zetsubou_0.test.bean;

import com.zetsubou_0.test.service.SimpleService;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.scripting.SlingScriptHelper;

/**
 * Created by zetsubou_0 on 20.04.15.
 */
public class Page {
    private String title;
    private String description;
    private SlingScriptHelper sling;

    public Page() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setSling(SlingScriptHelper sling) {
        this.sling = sling;
    }

    public String getHello() {
        return sling.getService(SimpleService.class).hello();
    }

    public ResourceResolver getResolver() {
        return sling.getService(SimpleService.class).getResolver();
    }
}
