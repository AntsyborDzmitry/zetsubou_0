package com.dhl.taglib.nls;

import com.day.cq.wcm.api.LanguageManager;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.scripting.SlingBindings;
import org.apache.sling.api.scripting.SlingScriptHelper;
import org.apache.sling.scripting.jsp.util.TagUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.TagSupport;
import java.io.IOException;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.ResourceBundle;

public class NlsTag extends TagSupport {

    private static final Logger LOG = LoggerFactory.getLogger(NlsTag.class);

    private static final String LOCALE_ATTR = NlsTag.class.getName() + "-locale";

    private String key;
    private String bundle;

    @Override
    public int doStartTag() throws JspException {
        ResourceBundle resourceBundle = getResourceBundle();
        try {
            pageContext.getOut().print(resourceBundle.getObject(key));
        } catch (IOException e) {
            LOG.error(String.format("Error while getting i18n message by key [%s] from bundle [%s]", key, bundle), e);
        }
        return TagSupport.EVAL_PAGE;
    }

    protected ResourceBundle getResourceBundle() {
        SlingHttpServletRequest request = TagUtil.getRequest(pageContext);
        ResourceBundle resourceBundle = getResourceBundleFromRequestAttribute(request);
        if (resourceBundle == null) {
            resourceBundle = request.getResourceBundle(bundle, getLocale(request));
            addResourceBundleToRequestAttribute(request, resourceBundle);
        }
        return resourceBundle;
    }

    @SuppressWarnings("unchecked")
    private ResourceBundle getResourceBundleFromRequestAttribute(SlingHttpServletRequest request) {
        Map<String, ResourceBundle> resourceBundles = (Map<String, ResourceBundle>) request.getAttribute(
                NlsConstants.BUNDLES_ATTR);
        if (resourceBundles != null && resourceBundles.containsKey(bundle)) {
            return resourceBundles.get(bundle);
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    private void addResourceBundleToRequestAttribute(SlingHttpServletRequest request, ResourceBundle resourceBundle) {
        Map<String, ResourceBundle> resourceBundles = (Map<String, ResourceBundle>) request.getAttribute(
                NlsConstants.BUNDLES_ATTR);
        if (resourceBundles == null) {
            resourceBundles = new HashMap<>();
            request.setAttribute(NlsConstants.BUNDLES_ATTR, resourceBundles);
        }
        resourceBundles.put(bundle, resourceBundle);
    }

    private Locale getLocale(SlingHttpServletRequest request) {
        Locale locale = (Locale) request.getAttribute(LOCALE_ATTR);
        if (locale == null) {
            locale = getLocaleFromResource(request.getResource());
            if (locale == null) {
                locale = request.getLocale();
            }
            request.setAttribute(LOCALE_ATTR, locale);
        }
        return locale;
    }

    private Locale getLocaleFromResource(Resource resource) {
        LanguageManager languageManager = getLanguageManager();
        return languageManager != null ? languageManager.getLanguage(resource) : null;
    }

    private LanguageManager getLanguageManager() {
        SlingBindings bindings = (SlingBindings) pageContext.getRequest().getAttribute(SlingBindings.class.getName());
        SlingScriptHelper scriptHelper = bindings.getSling();
        return scriptHelper.getService(LanguageManager.class);
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getBundle() {
        return bundle;
    }

    public void setBundle(String bundle) {
        this.bundle = bundle;
    }
}
