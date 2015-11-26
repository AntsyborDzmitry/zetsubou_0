package com.dhl.taglib.nls;

import org.junit.Before;
import org.junit.Test;

import javax.servlet.jsp.JspException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.ResourceBundle;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class NlsBundlesTagTest extends NlsBaseTest {

    protected static final Object[][] SIMPLE_BUNDLE_CONTENT = new Object[][]{
            {KEY2, KEY2_MESSAGE}
    };

    private NlsBundlesTag nlsBundlesTag;

    @Before
    public void setUp() {
        super.setUp();
        resourceBundle = new MockResourceBundle(SIMPLE_BUNDLE_CONTENT);
        Map<String, ResourceBundle> bundles = new HashMap<>();
        bundles.put(BUNDLE_NAME, resourceBundle);
        when(request.getAttribute(NlsConstants.BUNDLES_ATTR)).thenReturn(bundles);
        nlsBundlesTag = new NlsBundlesTag();
        nlsBundlesTag.setPageContext(pageContext);
    }

    @Test
    public void shouldPrintJson() throws JspException, IOException {
        nlsBundlesTag.doStartTag();
        verify(out).print("{\"" + BUNDLE_NAME + "\":{\"" + KEY2 + "\":\"" + KEY2_MESSAGE + "\"}}");
    }
}
