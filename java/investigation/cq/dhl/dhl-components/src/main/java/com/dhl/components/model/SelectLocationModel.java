package com.dhl.components.model;

import com.cognifide.slice.mapper.annotation.SliceResource;
import javax.inject.Inject;
import org.apache.sling.api.SlingHttpServletRequest;

import javax.servlet.http.Cookie;

@SliceResource
public class SelectLocationModel {

    private String defaultLocation;

    @Inject
    public SelectLocationModel(final SlingHttpServletRequest request) {
        Cookie defaultCountry = request.getCookie("defaultCountry");
        if (defaultCountry != null) {
            String url = request.getRequestURL().toString();
            String regexp = "(content/dhl/\\w{3}/\\w{2})/.*";
            defaultLocation = url.replaceAll(regexp, "content/dhl/" + defaultCountry.getValue().toLowerCase()
                    + "/en/auth/login.html");
        }
    }

    public String getDefaultLocation() {
        return defaultLocation;
    }
}
