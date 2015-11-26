package com.dhl.services.model;

import java.util.HashMap;

public class Dictionary extends HashMap<String, String> {

    private static final long serialVersionUID = 322458620753181465L;

    public Dictionary() {
        //should be empty
    }

    public Dictionary(int initialCapacity) {
        super(initialCapacity);
    }
}
