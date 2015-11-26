package com.dhl.taglib.nls;

import com.day.cq.wcm.api.LanguageManager;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.scripting.SlingBindings;
import org.apache.sling.api.scripting.SlingScriptHelper;

import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.PageContext;
import java.util.ListResourceBundle;
import java.util.Locale;
import java.util.ResourceBundle;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class NlsBaseTest {

    protected static final String BUNDLE_NAME = "bundle";
    protected static final String KEY1 = "key1";
    protected static final String KEY1_MESSAGE = "message1";
    protected static final String TITLE_ATTR = "title";
    protected static final String KEY1_TITLE_ATTR = KEY1 + "." + TITLE_ATTR;
    protected static final String KEY1_TITLE_ATTR_MESSAGE = "message1:title";
    protected static final String PLACEHOLDER_ATTR = "placeholder";
    protected static final String KEY1_PLACEHOLDER_ATTR = KEY1 + "." + PLACEHOLDER_ATTR;
    protected static final String KEY1_PLACEHOLDER_ATTR_MESSAGE = "message1:placeholder";
    protected static final String KEY2 = "key2";
    protected static final String KEY2_MESSAGE = "message2";
    protected static final Object[][] BUNDLE_CONTENT = new Object[][]{
            {KEY1, KEY1_MESSAGE},
            {KEY1_TITLE_ATTR, KEY1_TITLE_ATTR_MESSAGE},
            {KEY1_PLACEHOLDER_ATTR, KEY1_PLACEHOLDER_ATTR_MESSAGE},
            {KEY2, KEY2_MESSAGE}
    };

    protected PageContext pageContext = mock(PageContext.class);
    protected JspWriter out = mock(JspWriter.class);
    protected SlingHttpServletRequest request = mock(SlingHttpServletRequest.class);
    protected Resource resource = mock(Resource.class);
    protected LanguageManager languageManager = mock(LanguageManager.class);
    protected SlingBindings bindings = mock(SlingBindings.class);
    protected SlingScriptHelper scriptHelper = mock(SlingScriptHelper.class);
    protected Locale locale = Locale.ENGLISH;
    protected ResourceBundle resourceBundle = new MockResourceBundle(BUNDLE_CONTENT);

    public void setUp() {
        when(pageContext.getOut()).thenReturn(out);
        when(pageContext.getRequest()).thenReturn(request);
        when(request.getResource()).thenReturn(resource);
        when(request.getAttribute(SlingBindings.class.getName())).thenReturn(bindings);
        when(request.getResourceBundle(BUNDLE_NAME, locale)).thenReturn(resourceBundle);
        when(bindings.getSling()).thenReturn(scriptHelper);
        when(scriptHelper.getService(LanguageManager.class)).thenReturn(languageManager);
        when(languageManager.getLanguage(resource)).thenReturn(locale);
    }

    protected static class MockResourceBundle extends ListResourceBundle {

        private final Object[][] content;

        public MockResourceBundle(Object[][] content) {
            this.content = content;
        }

        @Override
        protected Object[][] getContents() {
            return content;
        }
    }
}
