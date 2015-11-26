package com.dhl.taglib.nls;

import com.day.cq.wcm.api.WCMMode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.TagSupport;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.ResourceBundle;

public class NlsAttrTag extends NlsTag {

    private static final Logger LOG = LoggerFactory.getLogger(NlsAttrTag.class);

    private static final String NLS_ATTR = "nls";

    @Override
    public int doStartTag() throws JspException {
       ResourceBundle resourceBundle = getResourceBundle();
        Map<String, String> attrs = getAttributesFromBundle(resourceBundle);
        if (WCMMode.fromRequest(pageContext.getRequest()) == WCMMode.EDIT) {
            attrs.put(NLS_ATTR, getNlsAttributeValue());
        }
        try {
            pageContext.getOut().print(getAttributesFormattedString(attrs));
        } catch (IOException e) {
            LOG.error(String.format("Error while getting i18n message by key [%s] from bundle [%s]",
                    getKey(), getBundle()), e);
        }
        return TagSupport.EVAL_PAGE;
    }

    private Map<String, String> getAttributesFromBundle(ResourceBundle resourceBundle) {
        Map<String, String> attrs = new HashMap<>();
        String keyPrefix = getKey() + ".";
        for (String key : resourceBundle.keySet()) {
            if (key.startsWith(keyPrefix)) {
                attrs.put(key.substring(keyPrefix.length()), resourceBundle.getString(key));
            }
        }
        return attrs;
    }

    private String getNlsAttributeValue() {
        return getBundle() + "." + getKey();
    }

    private String getAttributesFormattedString(Map<String, String> attrs) {
        StringBuilder attrBuilder = new StringBuilder();
        for (String attr : attrs.keySet()) {
            attrBuilder.append(attr).append("=").append("\"").append(attrs.get(attr)).append("\"").append(" ");
        }
        return attrBuilder.toString();
    }
}
