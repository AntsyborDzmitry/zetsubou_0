package com.dhl.components.model;

import org.apache.sling.api.SlingHttpServletRequest;
import org.junit.Test;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

public class RLTModelTest {
    private static final String RLT_MESSAGE = "Should be a \"rlt\" model.";
    private static final String NOT_RLT_MESSAGE = "Should be a \"lrt\" model.";
    private static final String RIGHT_TO_LEFT = " class=\"rtl\" dir=\"rtl\"";
    private static final String OTHER = " class=\"ltr\" ";
    private static final String URL_1 = "http://localhost:4502/content/dhl/ar/somePath.html";
    private static final String URL_2 = "http://localhost:4502/content/dhl/iw/somePath.html";
    private static final String URL_3 = "http://localhost:4502/content/dhl/he/somePath.html";
    private static final String URL_4 = "http://localhost:4502/content/dhl/en/somePath.html";

    private SlingHttpServletRequest request = mock(SlingHttpServletRequest.class);

    @Test
    public void shouldRightToLeftWithAr() {
        StringBuffer buffer = new StringBuffer(URL_1); // NOSONAR
        when(request.getRequestURL()).thenReturn(buffer);
        RLTModel rltModel = new RLTModel(request);
        assertEquals(RLT_MESSAGE, true, rltModel.isRTL());
        assertEquals(RLT_MESSAGE, RIGHT_TO_LEFT, rltModel.getRLTClass());
    }

    @Test
    public void shouldRightToLeftWithIw() {
        StringBuffer buffer = new StringBuffer(URL_2); // NOSONAR
        when(request.getRequestURL()).thenReturn(buffer);
        RLTModel rltModel = new RLTModel(request);
        assertEquals(RLT_MESSAGE, true, rltModel.isRTL());
        assertEquals(RLT_MESSAGE, RIGHT_TO_LEFT, rltModel.getRLTClass());
    }

    @Test
    public void shouldRightToLeftWithHe() {
        StringBuffer buffer = new StringBuffer(URL_3); // NOSONAR
        when(request.getRequestURL()).thenReturn(buffer);
        RLTModel rltModel = new RLTModel(request);
        assertTrue(RLT_MESSAGE, rltModel.isRTL());
        assertEquals(RLT_MESSAGE, RIGHT_TO_LEFT, rltModel.getRLTClass());
    }

    @Test
    public void shouldLeftToRight() {
        StringBuffer buffer = new StringBuffer(URL_4); // NOSONAR
        when(request.getRequestURL()).thenReturn(buffer);
        RLTModel rltModel = new RLTModel(request);
        assertFalse(NOT_RLT_MESSAGE, rltModel.isRTL());
        assertEquals(NOT_RLT_MESSAGE, OTHER, rltModel.getRLTClass());
    }
}
