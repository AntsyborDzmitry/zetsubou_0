package com.zetsubou_0.locale.rest;

import com.zetsubou_0.locale.rest.impl.RestExecutor;

import java.io.IOException;
import java.util.Set;

public interface LocaleCreatorService {

    Set<String> getAllDictionaries(RestExecutor restExecutor) throws IOException;

    int createLocaleForDictionary(RestExecutor restExecutor, String dictionary, String locale) throws IOException;
}
