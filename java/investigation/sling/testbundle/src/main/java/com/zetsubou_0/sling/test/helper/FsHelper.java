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
    public static final String FILE = "file";

    private static final String BACK_SLASH = "\\";
    private static final String SLASH = "/";

    public static String getSlingPath(String baseFs, String baseSling, String absPath) throws Exception {
        StringBuilder path = new StringBuilder();
        baseFs = baseFs.replace(BACK_SLASH, SLASH);
        absPath = absPath.replace(BACK_SLASH, SLASH);

        if(!absPath.startsWith(baseFs)) {
            throw new Exception("Wrong root file system path");
        }
        path.append(baseSling);
        if(baseFs.endsWith(SLASH)) {
            if(!baseSling.endsWith(SLASH)) {
                path.append(SLASH);
            }
            path.append(absPath.replace(baseFs, StringUtils.EMPTY));
        } else {
            if(baseSling.endsWith(SLASH)) {
                path.delete(path.length() - 1, path.length());
            }
            path.append(absPath.replace(baseFs, StringUtils.EMPTY));
        }

        return path.toString();
    }

    public static String getFsPath(String baseFs, String baseSling, String absPath) throws Exception {
        StringBuilder path = new StringBuilder();
        baseFs = baseFs.replace(BACK_SLASH, SLASH);
        absPath = absPath.replace(BACK_SLASH, SLASH);

        if(!absPath.startsWith(baseSling)) {
            throw new Exception("Wrong root file system path");
        }
        path.append(baseFs);
        if(baseFs.endsWith(SLASH)) {
            if(!baseFs.endsWith(SLASH)) {
                path.append(SLASH);
            }
            path.append(absPath.replace(baseSling, StringUtils.EMPTY));
        } else {
            if(baseFs.endsWith(SLASH)) {
                path.delete(path.length() - 1, path.length());
            }
            path.append(absPath.replace(baseSling, StringUtils.EMPTY));
        }

        return path.toString();
    }

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
