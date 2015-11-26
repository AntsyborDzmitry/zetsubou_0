package com.dhl.components.model;

import com.cognifide.slice.mapper.annotation.JcrProperty;
import com.cognifide.slice.mapper.annotation.SliceResource;

@SliceResource
public class ProfileTab {

    @JcrProperty("tabTitle")
    private String tabTitleProp;
    
    @JcrProperty("tabName")
    private String tabNameProp;

    public String getTabTitleProp() {
        return tabTitleProp;
    }

    public void setTabTitleProp(String tabTitleProp) {
        this.tabTitleProp = tabTitleProp;
    }

    public String getTabNameProp() {
        return tabNameProp;
    }

    public void setTabNameProp(String tabNameProp) {
        this.tabNameProp = tabNameProp;
    }
}