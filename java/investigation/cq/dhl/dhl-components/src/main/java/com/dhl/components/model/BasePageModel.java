package com.dhl.components.model;

import static org.apache.commons.lang.StringUtils.EMPTY;

import javax.inject.Inject;
import javax.servlet.http.Cookie;

import org.apache.sling.api.SlingHttpServletRequest;

import com.cognifide.slice.mapper.annotation.SliceResource;
import com.dhl.components.helper.UrlParser;
import com.neovisionaries.i18n.CountryCode;
import com.neovisionaries.i18n.LanguageCode;

/**
 * Slice model for Abstract page component
 */
@SliceResource
public class BasePageModel {

    private static final String ECOM_WFPRO_COOKIE = "ecomWFPro";

    private static final String DEFAULT_LANGUAGE = LanguageCode.en.getName();

    private String mainUrl;

    private String languageName;

    private String countryCss;

    private String urlWithLang;

    private boolean loggedIn;

    @Inject
    public BasePageModel(final SlingHttpServletRequest slingServletRequest) {
        initAttributes(slingServletRequest.getRequestURL().toString());
        initLoginStatus(slingServletRequest.getCookie(ECOM_WFPRO_COOKIE));
    }

    private void initAttributes(final String requestUrl) {
        UrlParser parser = new UrlParser(requestUrl);
        setMainUrl(parser.getContentPath());
        setUrlWithLang(parser.getFullContentPath());
        LanguageCode code = parser.getLanguageCode();
        setLanguageName(code != null ? code.getName() : DEFAULT_LANGUAGE);
        // Prepare catalyst-style two-letter country codes for CSS:
        CountryCode countryCode = parser.getCountryCode();
        setCountryCss(countryCode != null ? countryCode.getAlpha2() : EMPTY);
    }

    private void initLoginStatus(final Cookie ecomWFPro) {
        setLoggedIn(ecomWFPro != null);
    }

    public String getUrlWithLang() {
        return urlWithLang;
    }

    public void setUrlWithLang(String urlWithLang) {
        this.urlWithLang = urlWithLang;
    }

    public String getMainUrl() {
        return mainUrl;
    }

    public String getLanguageName() {
        return languageName;
    }

    public void setLanguageName(String languageName) {
        this.languageName = languageName;
    }

    public String getCountryCss() {
        return countryCss;
    }

    public void setCountryCss(String countryCss) {
        this.countryCss = countryCss;
    }

    public boolean isLoggedIn() {
        return loggedIn;
    }

    public void setLoggedIn(boolean loggedIn) {
        this.loggedIn = loggedIn;
    }

    public void setMainUrl(String mainUrl) {
        this.mainUrl = mainUrl;
    }
}
