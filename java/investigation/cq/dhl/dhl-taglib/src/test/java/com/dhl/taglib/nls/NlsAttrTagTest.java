package com.dhl.taglib.nls;

import com.day.cq.wcm.api.WCMMode;
import org.apache.commons.lang3.StringUtils;
import org.junit.Before;
import org.junit.Test;

import javax.servlet.jsp.JspException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class NlsAttrTagTest extends NlsBaseTest {

    private static final String NLS_ATTR = "nls";

    private NlsAttrTag nlsAttrTag;

    @Before
    public void setUp() {
        super.setUp();
        nlsAttrTag = new NlsAttrTag();
        nlsAttrTag.setPageContext(pageContext);
    }

    @Test
    public void shouldPrintEmptyMessageFromBundle() throws JspException, IOException {
        nlsAttrTag.setKey(KEY2);
        nlsAttrTag.setBundle(BUNDLE_NAME);
        nlsAttrTag.doStartTag();
        verify(out).print(StringUtils.EMPTY);
    }

    @Test
    public void shouldPrintNlsAttr() throws JspException, IOException {
        when(request.getAttribute(WCMMode.REQUEST_ATTRIBUTE_NAME)).thenReturn(WCMMode.EDIT);

        nlsAttrTag.setKey(KEY2);
        nlsAttrTag.setBundle(BUNDLE_NAME);
        nlsAttrTag.doStartTag();
        verify(out).print(getAttrAndValueString(NLS_ATTR, BUNDLE_NAME + "." + KEY2));
    }

    @Test
    public void shouldPrintNlsAndOtherAttrs() throws JspException, IOException {
        when(request.getAttribute(WCMMode.REQUEST_ATTRIBUTE_NAME)).thenReturn(WCMMode.EDIT);

        Map<String, String> attrs = new HashMap<>();
        attrs.put(NLS_ATTR, BUNDLE_NAME + "." + KEY1);
        attrs.put(PLACEHOLDER_ATTR, KEY1_PLACEHOLDER_ATTR_MESSAGE);
        attrs.put(TITLE_ATTR, KEY1_TITLE_ATTR_MESSAGE);

        nlsAttrTag.setKey(KEY1);
        nlsAttrTag.setBundle(BUNDLE_NAME);
        nlsAttrTag.doStartTag();

        verify(out).print(getAttributesFormattedString(attrs));
    }

    private String getAttrAndValueString(String attr, String value) {
        return attr + "=\"" + value + "\" ";
    }

    private String getAttributesFormattedString(Map<String, String> attrs) {
        StringBuilder attrBuilder = new StringBuilder();
        for (String attr : attrs.keySet()) {
            attrBuilder.append(getAttrAndValueString(attr, attrs.get(attr)));
        }
        return attrBuilder.toString();
    }
}
