package com.dhl.components.helper;

import static org.apache.commons.lang.StringUtils.EMPTY;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.neovisionaries.i18n.CountryCode;
import com.neovisionaries.i18n.LanguageCode;

public class UrlParser {
    
    private static final Logger LOG = LoggerFactory.getLogger(UrlParser.class);

    private static final int LANGUAGE_CONTENT_GROUP = 1;

    private static final int CONTENT_URL_GROUP = 2;

    private static final int COUNTRY_GROUP = 3;

    private static final int LANGUAGE_GROUP = 4;

    // TODO: Move to constant class or OSGi properties
    private static final String CONTENT_DHL_PATH = "/content/dhl";

    // Group 1: Concrete language content path
    // http://domain:4502/content/dhl/usa/en
    // Group 2: Base content path http://domain:4502/content/dhl/
    private static final String URL_REGEX = "((.*?" + CONTENT_DHL_PATH + "/)"
    // Group 3: Country
            + "([^/]*)/"
            // Group 4: Language
            + "([^/\\.]*))"
            // Non captured group: URL ending
            + "(?:.*)";

    private static final Pattern URL_PATTERN = Pattern.compile(URL_REGEX);

    private Matcher matcher;

    public UrlParser(final String url) {
        Validate.notEmpty(url, "The URL string is empty");
        this.matcher = URL_PATTERN.matcher(url);
        if (!matcher.matches()) {
            LOG.error("This is not valid URL: \"{}\"", url);
        }
    }

    private String get(int group) {
        return matcher.matches() ? matcher.group(group) : EMPTY;
    }

    public String getFullContentPath() {
        return get(LANGUAGE_CONTENT_GROUP);
    }

    public String getContentPath() {
        return get(CONTENT_URL_GROUP);
    }

    public String getCountry() {
        return get(COUNTRY_GROUP);
    }

    public String getLanguage() {
        return get(LANGUAGE_GROUP);
    }

    public CountryCode getCountryCode() {
        return CountryCode.getByCode(getCountry(), false);
    }

    public LanguageCode getLanguageCode() {
        return LanguageCode.getByCode(getLanguage(), false);
    }
}
