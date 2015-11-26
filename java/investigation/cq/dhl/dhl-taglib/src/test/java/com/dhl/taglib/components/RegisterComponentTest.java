package com.dhl.taglib.components;

import com.dhl.taglib.components.RegisterComponent;
import com.dhl.taglib.util.HtmlConst;
import org.apache.commons.lang3.StringUtils;
import org.junit.Before;
import org.junit.Test;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.PageContext;
import java.io.IOException;

import static org.mockito.Mockito.*;

public class RegisterComponentTest {
    private static final String ELEMENTS = "el1, el2";
    private static final String PATHS = "/path1, /path2";
    private static final String MODULES = "module1, module2";
    private static final char COMMA = ',';
    private static final int ARGUMENTS_COUNT = 3;
    private static final int EMPTY_STRING_COUNT = ARGUMENTS_COUNT - 1;

    private PageContext pageContext = mock(PageContext.class);
    private JspWriter out = mock(JspWriter.class);
    private RegisterComponent registerComponent = new RegisterComponent();

    @Before
    public void setupGeneralBehaviour() {
        when(pageContext.getOut()).thenReturn(out);
        registerComponent.setPageContext(pageContext);
    }

    @Test
    public void shouldWriteScriptTags() throws JspException, IOException {
        setupRegisterComponent(null, null, null);
        registerComponent.doStartTag();

        verify(out).write(HtmlConst.SCRIPT_START);
        verify(out, times(ARGUMENTS_COUNT)).write(StringUtils.EMPTY);
        verify(out).write(HtmlConst.SCRIPT_END);
    }

    @Test
    public void shouldWriteScriptTagsWithElements() throws JspException, IOException {
        String expectedString = getExpectedString(HtmlConst.REGISTER_ELEMENT, ELEMENTS);
        setupRegisterComponent(ELEMENTS, null, null);
        registerComponent.doStartTag();

        verify(out).write(expectedString);
        verify(out, times(EMPTY_STRING_COUNT)).write(StringUtils.EMPTY);
    }

    @Test
    public void shouldWriteScriptTagsWithModules() throws JspException, IOException {
        String expectedString = getExpectedString(HtmlConst.REQUIRE_MODULE, MODULES);
        setupRegisterComponent(null, MODULES, null);
        registerComponent.doStartTag();

        verify(out).write(expectedString);
        verify(out, times(EMPTY_STRING_COUNT)).write(StringUtils.EMPTY);
    }

    @Test
    public void shouldWriteScriptTagsWithPaths() throws JspException, IOException {
        String expectedString = getExpectedString(HtmlConst.REGISTER_COMPONENT, PATHS);
        setupRegisterComponent(null, null, PATHS);
        registerComponent.doStartTag();

        verify(out).write(expectedString);
        verify(out, times(EMPTY_STRING_COUNT)).write(StringUtils.EMPTY);
    }

    private String getExpectedString(final String pattern, final String arrayString) {
        String[] array = StringUtils.stripAll(StringUtils.split(arrayString, COMMA));
        StringBuilder expectedString = new StringBuilder();
        for (String string : array) {
            expectedString.append(String.format(pattern, string));
        }
        return expectedString.toString();
    }

    private void setupRegisterComponent(final String elements, final String modules, final String path) {
        registerComponent.setElements(elements);
        registerComponent.setModules(modules);
        registerComponent.setPaths(path);
    }
}
