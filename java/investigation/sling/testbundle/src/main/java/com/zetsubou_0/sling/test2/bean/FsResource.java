package com.zetsubou_0.sling.test2.bean;

import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.SyntheticResource;

import java.io.File;

/**
 * Created by Kiryl_Lutsyk on 10/13/2015.
 */
public class FsResource extends SyntheticResource {
    private final File file;

    public FsResource(ResourceResolver resourceResolver, String path, String resourceType, File file) {
        super(resourceResolver, path, resourceType);
        this.file = file;
    }

    public File getFile() {
        return file;
    }
}
