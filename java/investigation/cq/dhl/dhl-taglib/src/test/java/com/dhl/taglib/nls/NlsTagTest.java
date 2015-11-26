package com.dhl.taglib.nls;

import org.junit.Before;
import org.junit.Test;

import javax.servlet.jsp.JspException;
import java.io.IOException;

import static org.mockito.Mockito.verify;

public class NlsTagTest extends NlsBaseTest {

    private NlsTag nlsTag;

    @Before
    public void setUp() {
        super.setUp();
        nlsTag = new NlsTag();
        nlsTag.setPageContext(pageContext);
    }

    @Test
    public void shouldPrintMessageFromBundle() throws JspException, IOException {
        nlsTag.setKey(KEY1);
        nlsTag.setBundle(BUNDLE_NAME);
        nlsTag.doStartTag();
        verify(out).print((Object) KEY1_MESSAGE);
    }
}
