package com.zetsubou_0.sling.test.modifyingresourceprovider;

import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.resource.*;

import java.io.File;

/**
 * Created by Kiryl_Lutsyk on 10/7/2015.
 */
public class CustomFsResource extends AbstractResource {
    private final ResourceResolver resourceResolver;
    private final  String fsPath;
    private final String resourcePath;
    private final File file;
    private final ResourceMetadata resourceMetadata;

    public CustomFsResource(ResourceResolver resourceResolver, String relPath) throws ResourceNotFoundException {
        if(relPath.startsWith("/") || relPath.startsWith("\\")) {
            relPath = relPath.substring(1);
        }
        this.resourceResolver = resourceResolver;
        this.resourcePath = String.format(CustomSlingConstants.DEFAULT_SLING_ROOT, relPath);
        this.fsPath = String.format(CustomSlingConstants.DEFAULT_FS_ROOT, relPath);
        this.file = new File(this.fsPath);
        this.resourceMetadata = new ResourceMetadata();
        if(this.file == null) {
            throw new ResourceNotFoundException("FS resource " + this.fsPath + " not found");
        }
    }

    @Override
    public String getPath() {
        return this.resourcePath;
    }

    @Override
    public String getResourceType() {
        if(file.isDirectory()) {
            return JcrConstants.NT_FOLDER;
        } else {
            return JcrConstants.NT_FILE;
        }
    }

    @Override
    public String getResourceSuperType() {
        return JcrConstants.NT_UNSTRUCTURED;
    }

    @Override
    public ResourceMetadata getResourceMetadata() {
        return this.resourceMetadata;
    }

    @Override
    public ResourceResolver getResourceResolver() {
        return resourceResolver;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(this.getClass().getName());
        sb.append("[path = ");
        sb.append(getPath());
        sb.append(", resourceType = ");
        sb.append(getResourceType());
        sb.append("]");
        return sb.toString();
    }
}
