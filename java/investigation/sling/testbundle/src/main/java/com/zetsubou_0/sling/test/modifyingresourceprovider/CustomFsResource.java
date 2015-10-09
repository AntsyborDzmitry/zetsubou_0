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

    private boolean deleted = false;

    public CustomFsResource(ResourceResolver resourceResolver, String relPath) throws ResourceNotFoundException {
        if(relPath.startsWith("/") || relPath.startsWith("\\")) {
            relPath = relPath.substring(1);
        }
        String resourcePathTmp = String.format(CustomSlingConstants.DEFAULT_SLING_ROOT, relPath);
        String fsPathTmp = String.format(CustomSlingConstants.DEFAULT_FS_ROOT, relPath);
        if(resourcePathTmp.endsWith("/") || resourcePathTmp.endsWith("\\")) {
            resourcePathTmp = resourcePathTmp.substring(0, resourcePathTmp.length() - 1);
        }
        if(fsPathTmp.endsWith("/") || fsPathTmp.endsWith("\\")) {
            fsPathTmp = fsPathTmp.substring(0, fsPathTmp.length() - 1);
        }
        this.resourceResolver = resourceResolver;
        this.resourcePath = resourcePathTmp;
        this.fsPath = fsPathTmp;
        this.file = new File(this.fsPath);
        this.resourceMetadata = new ResourceMetadata();
        if(this.file == null) {
            throw new ResourceNotFoundException("FS resource " + this.fsPath + " not found");
        }
    }

    public File getFile() {
        return file;
    }

    public String getFsPath() {
        return fsPath;
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
        sb.append("[resourcePath = ");
        sb.append(getPath());
        sb.append(", filePath = ");
        sb.append(this.fsPath);
        sb.append(", resourceType = ");
        sb.append(getResourceType());
        sb.append(", metadata = ");
        sb.append(getResourceMetadata());
        sb.append("]");
        return sb.toString();
    }

    public void fullRemove() throws PersistenceException {
        deleted = true;
        recursiveDelete(file);
        if(deleted) {
            resourceResolver.delete(this);
        }
        deleted = false;
    }

    private void recursiveDelete(File file) {
        if(file.isDirectory()) {
            for(File f : file.listFiles()) {
                recursiveDelete(f);
            }
        }
        deleted &= file.delete();
    }
}
