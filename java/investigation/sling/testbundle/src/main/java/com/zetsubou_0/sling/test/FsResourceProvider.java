package com.zetsubou_0.sling.test;

import com.zetsubou_0.sling.test.api.FsPropertyProvider;
import com.zetsubou_0.sling.test.bean.FsResource;
import com.zetsubou_0.sling.test.helper.FsHelper;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.resource.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * Created by Kiryl_Lutsyk on 10/9/2015.
 */
@Component(
        name = FsResourceProvider.COMPONENT_NAME,
        label="Custom File System Resource Provider",
        description="Custom File System Resource Provider",
        configurationFactory=true,
        policy= ConfigurationPolicy.REQUIRE,
        metatype=true
)
@Service(value = {ResourceProvider.class, FsPropertyProvider.class})
@Properties({
        @Property(name = FsResourceProvider.COMPONENT_PROPERTY, value = FsResourceProvider.COMPONENT_NAME, propertyPrivate = true),
        @Property(name="service.description", value="Test Filesystem Resource Provider"),
        @Property(name="service.vendor", value="Test")
})
public class FsResourceProvider implements ResourceProvider, FsPropertyProvider {
    public static final String COMPONENT_NAME = "com.zetsubou_0.sling.test.FsResourceProvider";
    public static final String COMPONENT_PROPERTY = "componentName";
    public static final String DEFAULT_SLING_MOUNT_POINT = "/content/fs";
    public static final String DEFAULT_FS_MOUNT_POINT = "d:/temp/00";

    private static final Logger LOG = LoggerFactory.getLogger(FsResourceProvider.class);

    /**
     * Mount point into sling repository
     */
    @Property(value = DEFAULT_SLING_MOUNT_POINT)
    public static final String SLING_MOUNT_POINT = ResourceProvider.ROOTS;
    /**
     * System directory
     */
    @Property(value = DEFAULT_FS_MOUNT_POINT)
    public static final String FS_MOUNT_POINT = "provider.mount.fs";

    @Reference(cardinality = ReferenceCardinality.OPTIONAL_UNARY, policy = ReferencePolicy.DYNAMIC)
    private ResourceResolverFactory resourceResolverFactory;

    private Map<String, Object> properties;
    private String slingMountPoint;
    private String fsMountPoint;

    @Override
    public Resource getResource(ResourceResolver resourceResolver, HttpServletRequest httpServletRequest, String s) {
        return getResource(resourceResolver, s);
    }

    @Override
    public Resource getResource(ResourceResolver resourceResolver, String s) {
        Resource resource = null;
        String fsRoot = (String) properties.get(FS_MOUNT_POINT);
        String slingRoot = (String) properties.get(SLING_MOUNT_POINT);

        if(s.startsWith(slingRoot)) {
            if(slingRoot.equals(s)) {
                resource = new SyntheticResource(resourceResolver, s, FsResource.RESOURCE_TYPE);
            } else {
                try {
                    resource = new FsResource(resourceResolver, new File(FsHelper.getFsPath(fsRoot ,slingRoot, s)), this.properties);
                } catch (Exception e) {
                    LOG.error(e.getMessage(), e);
                }
            }
        }

        return resource;
    }

    @Override
    public Iterator<Resource> listChildren(Resource resource) {
        try{
            String slingRoot = (String) properties.get(SLING_MOUNT_POINT);
            String fsRoot = (String) properties.get(FS_MOUNT_POINT);
            ResourceResolver resourceResolver = resourceResolverFactory.getAdministrativeResourceResolver(null);
            if(resource.getPath().startsWith(slingRoot)) {
                List<Resource> childResources = new ArrayList<>();
                File parentFile = new File(FsHelper.getFsPath(fsRoot, slingRoot, resource.getPath()));
                for(File file : parentFile.listFiles()) {
                    childResources.add(new FsResource(resourceResolver, file, this.properties));
                }
                return childResources.iterator();
            }
        } catch(Exception e) {
            LOG.error(e.getMessage(), e);
        }
        return null;
    }

    @Override
    public ResourceResolver getResourceResolver() {
        try {
            return resourceResolverFactory.getAdministrativeResourceResolver(null);
        } catch (LoginException e) {
            LOG.error(e.getMessage(), e);
            return null;
        }
    }

    @Override
    public String getSlingMountPoint() {
        return slingMountPoint;
    }

    @Override
    public String getFsMountPoint() {
        return fsMountPoint;
    }

    @Override
    public Map<String, Object> getProperties() {
        return properties;
    }

    protected void activate(Map<String, Object> properties) {
        this.properties = properties;
        slingMountPoint = (String) properties.get(SLING_MOUNT_POINT);
        fsMountPoint = (String) properties.get(FS_MOUNT_POINT);
    }
}
