package com.dhl.services.service;

import com.dhl.services.model.CqLocale;
import com.dhl.services.model.Dictionary;
import com.dhl.services.model.Lang;

import java.util.List;
import java.util.Map;

public interface NlsService {
    /**
     * Returns all available translations for current page, empty list if no translation available
     *
     * @param pagePath full page URL excluding language
     * @param country country code
     * @return list of languages available for this page
     */
    List<Lang> availableLangs(String pagePath, String country);

    /**
     * Returns all texts/labels available in CQ in all specified dictionaries for specified language
     *
     * @param cqLocale locale info
     * @param dictionaries list of dictionaries in CQ
     * @return map from NLS keys to translated strings
     */
    Map<String, Dictionary> getResources(CqLocale cqLocale, List<String> dictionaries);

    /**
     * Returns all texts/labels available in CQ for basic (master) language corresponding to the specified language
     *
     * @param cqLocale locale info
     * @param dictionary dictionary in CQ
     * @return map from NLS keys to translated strings
     */
    Map<String, String> getLanguageResources(CqLocale cqLocale, String dictionary);

    /**
     * Returns descriptions for all texts/labels available in CQ for specified language
     *
     * @param lang language code
     * @param dictionary dictionary in CQ
     * @return map from NLS keys to descriptions intended for translators
     */
    Map<String, String> getDescriptions(String lang, String dictionary);

    /**
     * Replaces translation for the given key.
     *
     * @param resourceId NLS key of the string to update
     * @param value new translation for this string
     * @param dictionary dictionary in CQ
     * @param lang language code
     */
    void updateResources(String resourceId, String value, String dictionary, String lang);
}