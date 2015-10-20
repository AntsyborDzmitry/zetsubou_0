package com.zetsubou_0.sling.test.bean;

import com.zetsubou_0.sling.test.FsResourceProvider;
import com.zetsubou_0.sling.test.helper.FsHelper;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.adapter.annotations.Adaptable;
import org.apache.sling.adapter.annotations.Adapter;
import org.apache.sling.api.resource.*;
import org.apache.sling.api.wrappers.ValueMapDecorator;

import javax.activation.MimetypesFileTypeMap;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.*;

/**
 * Created by Kiryl_Lutsyk on 10/13/2015.
 */
@Adaptable(adaptableClass=Resource.class, adapters={
        @Adapter({ValueMap.class}),
        @Adapter({File.class}),
        @Adapter({InputStream.class})
})
public class FsResource extends AbstractResource {
    public static final String RESOURCE_TYPE = "fileSystem/resource";
    public static final String FILE_TYPE = "fileType";
    public static final String CREATED = "created";
    public static final String MIME_TYPE = "mimeType";
    public static final String SLING_RESOURCE_TYPE = "sling:resourceType";

    private final ValueMap valueMap;
    private final ResourceResolver resourceResolver;
    private final File file;
    private final Map<String, Object> properties;
    private ResourceMetadata resourceMetadata = new ResourceMetadata();
    private String mimeType;

    public FsResource(ResourceResolver resourceResolver, File file, Map<String, Object> properties) {
        this.resourceResolver = resourceResolver;
        this.file = file;
        this.properties = properties;

        // init metaData
        String fileType = (file.isDirectory()) ? JcrConstants.NT_FOLDER : JcrConstants.NT_FILE;
        resourceMetadata.setResolutionPath(getPath());
        resourceMetadata.setCreationTime(file.lastModified());
        resourceMetadata.put(FILE_TYPE, fileType);
        resourceMetadata.put(SLING_RESOURCE_TYPE, RESOURCE_TYPE);

        valueMap = new ValueMapDecorator(new HashMap<String, Object>());
        valueMap.put(FILE_TYPE, resourceMetadata.get(FILE_TYPE));
        valueMap.put(CREATED, new Date(resourceMetadata.getCreationTime()));
        if(!file.isDirectory()) {
            mimeType = new MimetypesFileTypeMap().getContentType(file);
            valueMap.put(MIME_TYPE, mimeType);
        }
    }

    public File getFile() {
        return file;
    }

    public String getMimeType() {
        return mimeType;
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

    @Override
    public <AdapterType> AdapterType adaptTo(Class<AdapterType> type) {
        if(type == ValueMap.class) {
            return (AdapterType) valueMap;
        } else if(type == File.class) {
            return (AdapterType) file;
        } else if(type == InputStream.class) {
            try {
                FileInputStream in = new FileInputStream(file);
                return (AdapterType) in;
            } catch (FileNotFoundException e) {}
        }
        return super.adaptTo(type);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("[ resource type = ");
        sb.append(getResourceType());
        sb.append(", file type = ");
        sb.append(valueMap.get(FILE_TYPE));
        sb.append(", file path = ");
        sb.append(file.getPath());
        if(!file.isDirectory()) {
            sb.append(", mime type = ");
            sb.append(valueMap.get(MIME_TYPE));
        }
        sb.append(" ]");
        return sb.toString();
    }
}
