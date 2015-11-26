package com.dhl.services.service;

import com.dhl.services.dao.RepositoryRuntimeException;
import com.dhl.services.dao.SlingDao;
import com.dhl.services.model.CqLocale;
import com.dhl.services.model.Dictionary;
import com.dhl.services.model.Lang;

import org.apache.commons.lang.StringUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;

import javax.jcr.Node;
import javax.jcr.RepositoryException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.dhl.services.dao.SlingDao.*;

@Component
@Service(NlsService.class)
public class NlsServiceImpl implements NlsService {
    public static final String NO_DESCRIPTION = "-No description-";

    @Reference
    private SlingDao slingDao;

    @Override
    public List<Lang> availableLangs(String pagePath, String country) {
        List<Lang> languages = new ArrayList<>();

        try {
            List<Node> langNodes = slingDao.getNodes("/content/dhl/" + country);
            for (Node langNode : langNodes) {
                if (langNode.getName().equals(CONTENT)) {
                    continue;
                }

                if (langNode.hasNode(pagePath)) {
                    String langId = langNode.getName();
                    String langName = slingDao.getNodeProperty(langNode.getNode(CONTENT), "langName");
                    Lang lang = new Lang(langId, langName);
                    languages.add(lang);
                }
            }
        } catch (RepositoryException e) {
            throw new RepositoryRuntimeException("Error occurred during collecting available langs", e);
        } finally {
            slingDao.closeSession();
        }

        return languages;
    }

    @Override
    public Map<String, String> getLanguageResources(final CqLocale cqLocale, String dictionary) {
        Dictionary multDictionaries = new Dictionary();
        try {
            return completeLangResourcesWithBasicLang(multDictionaries, dictionary, cqLocale.getLanguageCode());
        } catch (RepositoryException e) {
            throw new RepositoryRuntimeException("Error occurred during collecting localized messages", e);
        } finally {
            slingDao.closeSession();
        }
    }

    @Override
    public Map<String, Dictionary> getResources(final CqLocale cqLocale, List<String> dictionaries) {
        Map<String, Dictionary> multDictionaries = new HashMap<>();
        try {
            for (String dictionary : dictionaries) {
                Dictionary result = getSpecificCountryLangResources(dictionary , cqLocale);
                multDictionaries.put(dictionary, completeLangResourcesWithBasicLang(result, dictionary,
                                                                                    cqLocale.getLanguageCode()));
            }
            return multDictionaries;
        } catch (RepositoryException e) {
            throw new RepositoryRuntimeException("Error occurred during collecting localized messages", e);
        } finally {
            slingDao.closeSession();
        }
    }

    @Override
    public Map<String, String> getDescriptions(String lang, String dictionary) {
        try {
            Map<String, String> result = new HashMap<>();
            String dictLangPath = DEFAULT_DICTIONARY_PATH + dictionary + "/" + lang;
            if (slingDao.isNodeExists(dictLangPath)) {
                List<Node> nodes = slingDao.getNodes(dictLangPath);
                for (Node localizedMessage : nodes) {
                    String description;
                    if (localizedMessage.hasProperty(SLING_KEY_PROPERTY_KEY)) {
                        description = slingDao.getNodeProperty(localizedMessage, SLING_KEY_PROPERTY_KEY);
                        description = description.substring(description.indexOf('(') + 1, description.length() - 1);
                    } else {
                        description = NO_DESCRIPTION;
                    }
                    result.put(localizedMessage.getName(), description);
                }
            }
            return result;
        } catch (RepositoryException e) {
            throw new RepositoryRuntimeException("Error occurred during collecting localized messages", e);
        } finally {
            slingDao.closeSession();
        }
    }

    private Dictionary completeLangResourcesWithBasicLang(Dictionary multDictionaries,
                                                          String dictionary, String lang) throws RepositoryException {
        String dictionaryLang = DEFAULT_DICTIONARY_PATH + dictionary + '/' + lang;
        if (slingDao.isNodeExists(dictionaryLang)) {
            List<Node> nodes = slingDao.getNodes(dictionaryLang);
            for (Node localizedMessage : nodes) {
                String messageLabel = localizedMessage.getName();
                if (!multDictionaries.containsKey(messageLabel)) {
                    String translatedText = slingDao.getNodeProperty(localizedMessage, SLING_MESSAGE_PROPERTY_KEY);
                    if (StringUtils.isNotEmpty(translatedText)) {
                        multDictionaries.put(messageLabel, translatedText);
                    }
                }
            }
        }
        return multDictionaries;
    }

    private Dictionary getSpecificCountryLangResources(String dictionaryName,
                                                       CqLocale locale) throws RepositoryException {
        String dictForLanguage = DEFAULT_DICTIONARY_PATH + dictionaryName + "/" + locale.getLanguageCode() + "_" +
                locale.getCountryCode();
        boolean isLangExists = slingDao.isNodeExists(dictForLanguage);
        if (!isLangExists) {
            return new Dictionary();
        }
        List<Node> nodes = slingDao.getNodes(dictForLanguage);
        Dictionary dictionary = new Dictionary(nodes.size());
        for (Node localizedMessage : nodes) {
            String messageLabel = localizedMessage.getName();
            String translatedText = slingDao.getNodeProperty(localizedMessage, SLING_MESSAGE_PROPERTY_KEY);
            if (StringUtils.isNotEmpty(translatedText)) {
                dictionary.put(messageLabel, translatedText);
            }
        }
        return dictionary;
    }

    @Override
    public void updateResources(String resourceId, String value, String dictionary, String lang) {
        String dictForLanguage = DEFAULT_DICTIONARY_PATH + dictionary + "/" + lang;
        try {
            boolean isLangExists = slingDao.isNodeExists(dictForLanguage);
            if (!isLangExists) {
                throw new IllegalArgumentException("There is no node: " + dictForLanguage);
            }
            
            if (!updateResourceInDictionary(dictForLanguage, resourceId, value)) {
                String[] langCountry = lang.split("_");
                
                if (langCountry.length > 1) {
                    dictForLanguage = DEFAULT_DICTIONARY_PATH + dictionary + "/" + langCountry[0];
                    updateResourceInDictionary(dictForLanguage, resourceId, value);
                }
            }
        } catch (RepositoryException e) {
            throw new RepositoryRuntimeException("Error while trying to update i18n resources", e);
        } finally {
            slingDao.closeSession();
        }
    }
    
    private boolean updateResourceInDictionary(String dictionary, String resourceId, String newValue)
            throws RepositoryException {
        List<Node> nodes = slingDao.getNodes(dictionary);
        for (Node nlsNode : nodes) {
            String nlsNodeId = nlsNode.getName();
            if (resourceId.equals(nlsNodeId)) {
                nlsNode.setProperty(SLING_MESSAGE_PROPERTY_KEY, newValue);
                slingDao.saveSession();
                return true;
            }
        }
        return false;
    }
}