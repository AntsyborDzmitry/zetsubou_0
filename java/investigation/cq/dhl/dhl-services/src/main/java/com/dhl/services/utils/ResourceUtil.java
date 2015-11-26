package com.dhl.services.utils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import org.apache.sling.api.resource.Resource;

public final class ResourceUtil {

    private ResourceUtil() {
        // Utility class
    }

    /**
     * Lists paths to the direct children of this resource.
     * <p>
     * 
     * @param resource Parent resource
     * @return Children paths if resource valid, <code>Collections.emptyList()</code> otherwise
     */
    public static List<String> listChildrenPaths(final Resource resource) {
        if (resource == null) {
            return Collections.emptyList();
        }
        List<String> childrenPaths = new ArrayList<>();
        for (Iterator<Resource> iterator = resource.listChildren(); iterator.hasNext();) {
            Resource child = iterator.next();
            childrenPaths.add(child.getPath());
        }
        return childrenPaths;
    }
}