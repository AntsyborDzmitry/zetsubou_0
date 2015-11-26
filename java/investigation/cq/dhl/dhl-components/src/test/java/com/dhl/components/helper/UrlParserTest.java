package com.dhl.components.helper;

import com.neovisionaries.i18n.CountryCode;
import com.neovisionaries.i18n.LanguageCode;
import org.apache.commons.lang3.StringUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;

public class UrlParserTest {
    private static final String DOMAIN = "http://domain:4502";
    private static final String CONTENT = "/content/dhl/";
    private static final String COUNTRY = "usa";
    private static final String LANGUAGE = "en";
    private static final String OTHER = "/someUrlPart";
    // URL like "http://domain:4502/content/dhl/usa/en/someUrlPart"
    private static final String URL = "%s%s%s/%s%s";

    private final List<String> urls = new ArrayList<>();
    private UrlParser urlParser = null;

    @Before
    public void setupGeneralBehaviour() {
        urls.add(null);
        urls.add(StringUtils.EMPTY);
        urls.add(String.format(URL, DOMAIN, CONTENT, COUNTRY, LANGUAGE, OTHER));
    }

    @After
    public void resetGeneralBehaviour() {
        urls.clear();
        urlParser = null;
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldReturnNullIfUrlNull() {
        urlParser = new UrlParser(urls.get(0));
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldReturnNullIfUrlEmptyString() {
        urlParser = new UrlParser(urls.get(1));
    }

    @Test
    public void shouldReturnLanguageContentGroup() {
        urlParser = new UrlParser(urls.get(2));
        String languageContentGroup = urlParser.getFullContentPath();
        assertEquals("Wrong Language Content Group.",
                String.format(URL, DOMAIN, CONTENT, COUNTRY, LANGUAGE, StringUtils.EMPTY), languageContentGroup);
    }

    @Test
    public void shouldReturnContentUrl() {
        urlParser = new UrlParser(urls.get(2));
        String contentUrl = urlParser.getContentPath();
        assertEquals("Wrong Content Url.", DOMAIN + CONTENT, contentUrl);
    }

    @Test
    public void shouldReturnCountry() {
        urlParser = new UrlParser(urls.get(2));
        String country = urlParser.getCountry();
        assertEquals("Wrong Country.", COUNTRY, country);
    }

    @Test
    public void shouldReturnLanguage() {
        urlParser = new UrlParser(urls.get(2));
        String language = urlParser.getLanguage();
        assertEquals("Wrong Language.", LANGUAGE, language);
    }

    @Test
    public void shouldReturnCountryCode() {
        urlParser = new UrlParser(urls.get(2));
        CountryCode countryCode = urlParser.getCountryCode();
        assertEquals("Wrong Country code.", countryCode, CountryCode.getByCode(COUNTRY, false));
    }

    @Test
    public void shouldReturnLanguageCode() {
        urlParser = new UrlParser(urls.get(2));
        LanguageCode languageCode = urlParser.getLanguageCode();
        assertEquals("Wrong Language code.", languageCode, LanguageCode.getByCode(LANGUAGE, false));
    }
}
