package com.dhl.author.services.service;

import java.util.Map;
import java.util.Set;

public interface I18NHistoryService {

    /**
     * Create new version for given dictionary
     *
     * @param dictionaryPath Path to dictionary
     * @param versionName Name for newly created version
     */
    Map<String, String> makeDictionaryVersion(String dictionaryPath, String versionName);

    /**
     * Returns available versions for dictionary
     *
     * @param originalPath fetch versions for this path
     * @return Set of versions
     */
    Set<String> fetchDictionaryVersions(String originalPath);

    /**
     * Deletes selected version
     *
     * @param versionPath path to version
     * @return Map with operation result
     */
    Map<String, String> deleteDictionaryVersion(String versionPath);

    /**
     * Rollback to selected version
     *
     * @param versionPath selected version
     */
    void rollbackToVersion(String versionPath);
}
