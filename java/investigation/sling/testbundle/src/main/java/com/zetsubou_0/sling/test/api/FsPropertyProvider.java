package com.zetsubou_0.sling.test.api;

import org.apache.sling.api.resource.ResourceResolver;

import java.util.Map;

/**
 * Created by Kiryl_Lutsyk on 10/16/2015.
 */
public interface FsPropertyProvider {
    public Map<String, Object> getProperties();
    ResourceResolver getResourceResolver();
    String getSlingMountPoint();
    String getFsMountPoint();
}
