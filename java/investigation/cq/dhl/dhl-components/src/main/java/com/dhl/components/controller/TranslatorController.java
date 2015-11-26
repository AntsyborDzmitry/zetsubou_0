package com.dhl.components.controller;

import static org.apache.commons.lang.StringUtils.defaultIfBlank;

import javax.inject.Inject;
import javax.jcr.Property;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Value;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ResourceResolver;

import com.cognifide.slice.mapper.annotation.SliceResource;
import com.day.cq.commons.JS;

@SliceResource
public class TranslatorController {
    
    private static final String EMPTY_ARRAY = "[]";

    private static final String ETC_LANGUAGES = "/etc/languages/languages";

    private static final String CQ_I18N_TRANSLATOR_PATH = "/libs/cq/i18n/translator";

    private String path;

    private ResourceResolver resourceResolver;
    
    @Inject
    public TranslatorController(final SlingHttpServletRequest request) {
        this.path = defaultIfBlank(request.getParameter("path"), "/libs/wcm/core/i18n");
        this.resourceResolver = request.getResourceResolver();
    }

    public String getLanguages() throws RepositoryException {
        //TODO: Create administrative ResourceResolver 
        Session session = resourceResolver.adaptTo(Session.class);
        if (!session.propertyExists(ETC_LANGUAGES)) {
            return EMPTY_ARRAY;    
        }
        Property p = session.getProperty(ETC_LANGUAGES);
        if (p.isMultiple()) {
            final Value[] values = p.getValues();
            String[] languages = new String[values.length];
            for (int i = 0; i < values.length; i++) {
                languages[i] = values[i].getString();
            }
            return JS.array(languages);
        }
        return EMPTY_ARRAY; 
    }

    public String getBasePath() {
        return CQ_I18N_TRANSLATOR_PATH;
    }

    public String getPath() {
        return path;
    }
}
