package com.dhl.components.controller;

import static org.apache.commons.lang.StringUtils.defaultIfEmpty;

import javax.inject.Inject;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceUtil;
import org.apache.sling.api.resource.ValueMap;

import com.cognifide.slice.mapper.annotation.JcrProperty;
import com.cognifide.slice.mapper.annotation.SliceResource;
import com.day.cq.i18n.I18n;

@SliceResource
public class EmailTemplateController {

    private static final String DEFAULT_BUTTON_NAME = "Enter button name";

    private static final String EMAIL_SUBJECT_HEADER = "Email-Subject";

    @JcrProperty("jcr:buttonName")
    private String buttonName;

    @Inject
    public EmailTemplateController(final SlingHttpServletRequest request, final SlingHttpServletResponse response,
            final Resource resource) {
        ValueMap properties = ResourceUtil.getValueMap(resource);
        response.addHeader(EMAIL_SUBJECT_HEADER, I18n.getVar(request, properties.get("emailSubject", String.class)));
    }

    public String getButtonLabel() {
        return defaultIfEmpty(buttonName, DEFAULT_BUTTON_NAME);
    }
}
