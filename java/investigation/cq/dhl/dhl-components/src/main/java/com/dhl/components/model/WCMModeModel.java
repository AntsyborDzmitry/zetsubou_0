package com.dhl.components.model;

import javax.inject.Inject;

import org.apache.sling.api.SlingHttpServletRequest;

import com.cognifide.slice.mapper.annotation.SliceResource;
import com.day.cq.wcm.api.WCMMode;

@SliceResource
public class WCMModeModel {

    private WCMMode wcmMode;
    
    @Inject
    public WCMModeModel(final SlingHttpServletRequest slingServletRequest) {
        wcmMode = WCMMode.fromRequest(slingServletRequest);
    }
    
    public boolean isEnabled() {
        return !isDisabled();
    }
    public boolean isDisabled() {
        return WCMMode.DISABLED == wcmMode;
    }
    
    public boolean isEditMode() {
        return WCMMode.EDIT == wcmMode;
    }
}
