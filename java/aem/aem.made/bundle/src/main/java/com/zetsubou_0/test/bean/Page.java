package com.zetsubou_0.test.bean;

import org.apache.sling.api.scripting.SlingScriptHelper;

/**
* Created by zetsubou_0 on 20.04.15.
*/
public class Page {
    private String title;
    private SlingScriptHelper sling;

    public Page() {
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTitle() {
        return title;
    }

    public String getConnection() {
        return null;
    }

    public void setSling(SlingScriptHelper sling) {
        this.sling = sling;
    }

}