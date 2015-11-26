package com.dhl.services.model;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * Represents Lang info
 */
@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class Lang {
    private final String id;

    private final String name;

    public Lang(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}