package com.dhl.components.controller;

import com.day.cq.commons.JS;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.Before;
import org.junit.Test;

import javax.jcr.Property;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Value;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

public class TranslatorControllerTest {
    private static final String MESSAGE_EMPTY_ARRAY = "Languages should be an empty array.";
    private static final String EMPTY_ARRAY = "[]";
    private static final String ETC_LANGUAGES = "/etc/languages/languages";
    private static final String[] TEST_LANGUAGES = new String[] {"en", "de", "ua", "ru"};

    private TranslatorController controller;
    private SlingHttpServletRequest request = mock(SlingHttpServletRequest.class);
    private ResourceResolver resourceResolver = mock(ResourceResolver.class);
    private Session session = mock(Session.class);
    private Value[] values;

    @Before
    public void setupGeneralBehaviour() throws RepositoryException {
        when(request.getResourceResolver()).thenReturn(resourceResolver);
        when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
        values = new Value[TEST_LANGUAGES.length];
        for (int i = 0; i < TEST_LANGUAGES.length; i++) {
            Value value = mock(Value.class);
            when(value.getString()).thenReturn(TEST_LANGUAGES[i]);
            values[i] = value;
        }
        controller = new TranslatorController(request);
    }

    @Test
    public void shouldReturnEmptyLanguagesArray() throws RepositoryException {
        String languages = controller.getLanguages();
        assertEquals(MESSAGE_EMPTY_ARRAY, EMPTY_ARRAY, languages);

        Property property = mock(Property.class);
        when(session.propertyExists(ETC_LANGUAGES)).thenReturn(true);
        when(session.getProperty(ETC_LANGUAGES)).thenReturn(property);
        when(property.isMultiple()).thenReturn(false);
        languages = controller.getLanguages();
        assertEquals(MESSAGE_EMPTY_ARRAY, EMPTY_ARRAY, languages);
    }

    @Test
    public void shouldReturnLanguagesArray() throws RepositoryException {
        Property property = mock(Property.class);
        when(session.propertyExists(ETC_LANGUAGES)).thenReturn(true);
        when(session.getProperty(ETC_LANGUAGES)).thenReturn(property);
        when(property.isMultiple()).thenReturn(true);
        when(property.getValues()).thenReturn(values);

        String languages = controller.getLanguages();
        assertEquals("Not correct array.", JS.array(TEST_LANGUAGES), languages);
    }
}
