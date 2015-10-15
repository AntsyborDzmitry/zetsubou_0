package com.zetsubou_0.sling.test.helper;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingConstants;
import org.osgi.service.event.Event;

import java.util.*;

/**
 * Created by Kiryl_Lutsyk on 10/13/2015.
 */
public class FsHelper {
    public static final String HELPER_CLASS = FsHelper.class.getName();
    public static final String HELPER = "helper";
    public static final String EVENT_ADMIN = "eventAdmin";
    public static final String RESOURCE = "resource";
    public static final String FILE = "file";

    public static boolean checkEvent(Event event, String base) {
        String path = (String) event.getProperty(SlingConstants.PROPERTY_PATH);
        return FsHelper.HELPER_CLASS.equals(event.getProperty(FsHelper.HELPER)) || (StringUtils.isNotBlank(base) && StringUtils.isNotBlank(path) && path.startsWith(base));
    }

    public static Map<String, Object> getEventProperties(Event event, String ... keys) {
        Map<String, Object> properties = new HashMap<>();
        for(String key : keys) {
            Object val = event.getProperty(key);
            if(val != null) {
                properties.put(key, val);
            }
        }
        return properties;
    }
}
