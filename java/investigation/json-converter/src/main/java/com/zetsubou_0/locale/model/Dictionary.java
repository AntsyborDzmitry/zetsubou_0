package com.zetsubou_0.locale.model;

import org.codehaus.jackson.annotate.JsonProperty;

import java.util.Map;

public class Dictionary {

    private String name;

    private String type;

    @JsonProperty(value = "message_keys")
    private Map<String, Key> messages;

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(final String type) {
        this.type = type;
    }

    public Map<String, Key> getMessages() {
        return messages;
    }

    public void setMessages(final Map<String, Key> messages) {
        this.messages = messages;
    }

    public static class Key {

        private String value;

        private String type;

        private String description;

        private String key;

        public String getValue() {
            return value;
        }

        public void setValue(final String value) {
            this.value = value;
        }

        public String getType() {
            return type;
        }

        public void setType(final String type) {
            this.type = type;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(final String description) {
            this.description = description;
        }

        public String getKey() {
            return key;
        }

        public void setKey(final String key) {
            this.key = key;
        }
    }
}
