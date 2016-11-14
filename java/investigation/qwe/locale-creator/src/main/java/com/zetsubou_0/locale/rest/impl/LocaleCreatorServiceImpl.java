package com.zetsubou_0.locale.rest.impl;

import com.zetsubou_0.locale.rest.LocaleCreatorService;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;

import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public class LocaleCreatorServiceImpl implements LocaleCreatorService {

    private static final String DICTIONARY_URL = "/etc/dhl/i18n/";

    private static final String PATH_SEPARATOR = "/";

    private static final String SELECTOR = ".";

    private static final String JCR_PREFIX = "jcr:";

    private static final String LOCALE = "\"jcr:language\":\"%s\"";

    private static final String PATTERN_CREATED = "(\"(jcr:created(By)?|(cq:last.+?))\":\".+?\"[,]?)*";

    private static final Pattern PATTERN_MESSAGE = Pattern.compile("((sling:message\":\")(.+?\"))+");

    private static final Pattern PATTERN_LANGUAGE = Pattern.compile("jcr:language\":\"([a-zA-Z_]+)\"");

    @Override
    public Set<String> getAllDictionaries(final RestExecutor restExecutor) throws IOException {
        String response = restExecutor.executeGet(getUrlForObtainingData(DICTIONARY_URL, 1), Collections.emptyMap());
        return readDictionariesFromResponse(response);
    }

    @Override
    public int createLocaleForDictionary(final RestExecutor restExecutor, final String dictionary, final String locale)
            throws IOException{
        String content = restExecutor.executeGet(
                getUrlForObtainingData(DICTIONARY_URL + dictionary + "/en", 1), Collections.emptyMap());
        content = createLocalizedResponse(content, locale);
        boolean removed = false;
        int status = content == null
                ? 500
                : saveChanges(restExecutor, content, locale, DICTIONARY_URL + dictionary);
        if (status == 412) {
            status = removeExists(restExecutor, DICTIONARY_URL + dictionary + PATH_SEPARATOR + locale);
            removed = true;
        }
        return status >= 200 && status < 300 && removed
                ? saveChanges(restExecutor, content, locale, DICTIONARY_URL + dictionary)
                : status;
    }

    private String getUrlForObtainingData(final String baseUrl, int level) {
        String validUrl = baseUrl.endsWith(PATH_SEPARATOR)
                ? baseUrl.substring(0, baseUrl.length() - 1)
                : baseUrl;
        return validUrl + SELECTOR + level + ".json";
    }

    private Set<String> readDictionariesFromResponse(final String response) throws IOException {
        JsonNode jsonNode = new ObjectMapper().readTree(response);
        Spliterator<String> spliterator =
                Spliterators.spliteratorUnknownSize(jsonNode.getFieldNames(), Spliterator.ORDERED);
        return StreamSupport
                .stream(spliterator, false)
                .filter(property -> !property.startsWith(JCR_PREFIX))
                .collect(Collectors.toSet());
    }

    private String createLocalizedResponse(final String content, final String locale) {
        String result = getLocalizedString(content, locale);
        if (result == null) {
            return null;
        }
        result = getTextWithoutCreatedData(result);
        return getTextWithLocalePrefix(result, locale);
    }

    private String getLocalizedString(final String content, final String locale) {
        Matcher matcher = PATTERN_LANGUAGE.matcher(content);
        if (matcher.find()) {
            return content.replace(String.format(LOCALE, matcher.group(1)), String.format(LOCALE, locale));
        }
        return null;
    }

    private String getTextWithoutCreatedData(final String content) {
        return content.replaceAll(PATTERN_CREATED, "");
    }

    private String getTextWithLocalePrefix(final String content, final String locale) {
        Matcher matcher = PATTERN_MESSAGE.matcher(content);
        return matcher.replaceAll("$2" + locale +"-$3");
    }

    private int saveChanges(final RestExecutor restExecutor, final String content, final String locale,
                            final String dictionaryUrl) throws IOException {
        Map<String, String> properties = new HashMap<>();
        properties.put(":operation", "import");
        properties.put(":contentType", "json");
        properties.put(":name", locale);
        properties.put(":content", content);
        return restExecutor.executePost(dictionaryUrl, properties);
    }

    private int removeExists(final RestExecutor restExecutor, final String path) throws IOException {
        return restExecutor.executeDelete(path);
    }
}
