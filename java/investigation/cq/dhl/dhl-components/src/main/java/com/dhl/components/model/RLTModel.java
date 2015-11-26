package com.dhl.components.model;

import javax.inject.Inject;

import org.apache.sling.api.SlingHttpServletRequest;

import com.cognifide.slice.mapper.annotation.SliceResource;

@SliceResource
public class RLTModel {

    private boolean isRightToLeft;
    
    @Inject
    public RLTModel(final SlingHttpServletRequest request) {
        String url = request.getRequestURL().toString();
        //TODO: Move this rules to OSGI props  
        this.isRightToLeft = url.contains("/ar/") || url.contains("/iw/") || url.contains("/he/");
    }

    public boolean isRTL() {
        return isRightToLeft;
    }
    
    public String getRLTClass() {
        return isRightToLeft ? " class=\"rtl\" dir=\"rtl\"" : " class=\"ltr\" "; 
    }
}
