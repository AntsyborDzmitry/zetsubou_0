package com.dhl.components.model;

import java.util.List;

import com.cognifide.slice.mapper.annotation.JcrProperty;
import com.cognifide.slice.mapper.annotation.SliceResource;
import com.dhl.components.annotation.Children;

@SliceResource
public class ProfileDetailsModel {

    @Children(ProfileTab.class)
    @JcrProperty("tabs-container")
    private List<ProfileTab> profileTabs;

    public List<ProfileTab> getProfileTabs() {
        return profileTabs;
    }
}
