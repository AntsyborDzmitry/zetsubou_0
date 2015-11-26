package com.dhl.taglib.nls;

import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.TagSupport;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.ResourceBundle;

public class NlsBundlesTag extends TagSupport {

    private static final Logger LOG = LoggerFactory.getLogger(NlsBundlesTag.class);

    @Override
    @SuppressWarnings("unchecked")
    public int doStartTag() throws JspException {
        Map<String, ResourceBundle> bundles = (Map<String, ResourceBundle>) pageContext.getRequest().getAttribute(
                NlsConstants.BUNDLES_ATTR);
        if (bundles != null) {
            try {
                pageContext.getOut().print(toJson(bundles));
            } catch (IOException | JSONException e) {
                LOG.error("Error while getting a list of used i18n bundles in json format", e);
            }
        }
        return TagSupport.EVAL_PAGE;
    }

    private String toJson(Map<String, ResourceBundle> bundles) throws JSONException {
        JSONObject json = new JSONObject();
        for (String bundle : bundles.keySet()) {
            json.put(bundle,  new JSONObject(toMap(bundles.get(bundle))));
        }
        return json.toString();
    }

    private Map<String, String> toMap(ResourceBundle bundle) {
        Map<String, String> bundleMap = new HashMap<>();
        for (String key : bundle.keySet()) {
            bundleMap.put(key, bundle.getString(key));
        }
        return bundleMap;
    }
}
