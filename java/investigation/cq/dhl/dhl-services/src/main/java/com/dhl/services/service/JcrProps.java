package com.dhl.services.service;

public enum JcrProps {

    VERSION_PATH("/etc/dhl/i18nversions"),
    JCR_LANGUAGE("jcr:language"),
    LANGUAGE("language"),
    SLING_FOLDER("sling:Folder"),
    ORIGINAL_PATH("originalPath"),
    OK("ok"),
    ERROR("error"),
    VERSION_INFO("versionInfo"),
    STATUS("status");

    private String value;
    
    JcrProps(String value) {
        this.value = value;
    }

    public String getValue(){
        return value;
    }
}