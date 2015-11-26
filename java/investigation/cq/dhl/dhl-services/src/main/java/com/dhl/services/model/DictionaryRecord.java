package com.dhl.services.model;

import java.util.Map;

public class DictionaryRecord {
    private final String key;
    private final  String comment;
    private final Map<String, String> messages;

    public DictionaryRecord(final String key, final String comment, final Map<String, String> messages) {
        this.key = key;
        this.comment = comment;
        this.messages = messages;
    }

    public String getKey() {
        return key;
    }

    public String getComment() {
        return comment;
    }

    /**
     * Return pair language and translation for key from this record.
     *
     * @return messages pairs
     */
    public Map<String, String> getMessages() {
        return messages;
    }
}
