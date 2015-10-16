package com.zetsubou_0.sling.test.bean;

import com.zetsubou_0.sling.test.FsResourceProvider;
import com.zetsubou_0.sling.test.helper.FsHelper;
import org.apache.sling.api.resource.AbstractResource;
import org.apache.sling.api.resource.ResourceMetadata;
import org.apache.sling.api.resource.ResourceResolver;

import java.io.File;
import java.util.Map;

/**
 * Created by Kiryl_Lutsyk on 10/13/2015.
 */
public class FsResource extends AbstractResource {
    public static final String RESOURCE_TYPE = "fileSystem/resource";

    private final ResourceResolver resourceResolver;
    private final File file;
    private final Map<String, Object> properties;
    private ResourceMetadata resourceMetadata = new ResourceMetadata();

    public FsResource(ResourceResolver resourceResolver, File file, Map<String, Object> properties) {
        this.resourceResolver = resourceResolver;
        this.file = file;
        this.properties = properties;
        this.resourceMetadata.setResolutionPath(getPath());
    }

    public File getFile() {
        return file;
    }

    @Override
    public String getPath() {
        try {
            return FsHelper.getSlingPath((String) properties.get(FsResourceProvider.FS_MOUNT_POINT), (String) properties.get(FsResourceProvider.SLING_MOUNT_POINT), file.getPath());
        } catch (Exception e) {
            // ignore
        }
        return null;
    }

    @Override
    public String getResourceType() {
        return RESOURCE_TYPE;
    }

    @Override
    public String getResourceSuperType() {
        return null;
    }

    @Override
    public ResourceMetadata getResourceMetadata() {
        return resourceMetadata;
    }

    @Override
    public ResourceResolver getResourceResolver() {
        return resourceResolver;
    }
}
