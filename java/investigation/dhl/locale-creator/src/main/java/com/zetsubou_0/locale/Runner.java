package com.zetsubou_0.locale;

import com.zetsubou_0.locale.configuration.ConfigurationProperties;
import com.zetsubou_0.locale.rest.LocaleCreatorService;
import com.zetsubou_0.locale.rest.impl.LocaleCreatorServiceImpl;
import com.zetsubou_0.locale.rest.impl.RestExecutor;
import org.apache.log4j.Logger;

import java.io.IOException;
import java.util.Set;

public class Runner {

    private static final Logger LOG = Logger.getLogger(Runner.class);

    private static final LocaleCreatorService LOCALE_CREATOR_SERVICE = new LocaleCreatorServiceImpl();

    public static void main(String[] args) {

        ConfigurationProperties properties = ConfigurationProperties.readFromFile("configuration.properties");
        if (!properties.isDataObtained()) {
            return;
        }
        String locale = properties.getLocale();
        LOG.info("Start processing for locale: " + locale);
        try(RestExecutor executor = new RestExecutor(properties)) {
            Set<String> dictionaries = LOCALE_CREATOR_SERVICE.getAllDictionaries(executor);
            for (String dictionary : dictionaries) {
                LOG.info(dictionary + " dictionary is processing ...");
                int statusCode = LOCALE_CREATOR_SERVICE.createLocaleForDictionary(executor, dictionary, locale);
                if (statusCode < 200 || statusCode >= 300) {
                    LOG.warn(dictionary + " dictionary was processed with status code " + statusCode);
                    return;
                }
                LOG.info(dictionary + " dictionary was processed with status code " + statusCode);
            }
        } catch (IOException e) {
            LOG.error("Error occurred while creating new locales", e);
        }
        LOG.info("Processing is done");
    }
}
