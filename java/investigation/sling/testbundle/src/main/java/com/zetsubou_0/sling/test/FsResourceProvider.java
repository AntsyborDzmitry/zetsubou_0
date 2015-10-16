package com.zetsubou_0.sling.test;

import com.zetsubou_0.sling.test.bean.FsResource;
import com.zetsubou_0.sling.test.helper.FsHelper;
import com.zetsubou_0.sling.test.monitor.FileMonitor;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.resource.*;
import org.osgi.service.event.EventAdmin;

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
@Service
@Properties({
        @Property(name = "serviceName", value = FsResourceProvider.COMPONENT_NAME, propertyPrivate = true),
        @Property(name="service.description", value="Test Filesystem Resource Provider"),
        @Property(name="service.vendor", value="Test")
})
public class FsResourceProvider implements ResourceProvider {
    public static final String COMPONENT_NAME = "com.zetsubou_0.sling.test.FsResourceProvider";
    public static final String DEFAULT_SLING_MOUNT_POINT = "/content/fs";
    public static final String DEFAULT_FS_MOUNT_POINT = "d:/temp/00";
    public static final long DEFAULT_CHECKOUT_INTERVAL = 60000L;

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
    /**
     * Checkout interval
     */
    @Property(longValue = DEFAULT_CHECKOUT_INTERVAL)
    public static final String CHECKOUT_INTERVAL = "provider.checkOut.interval";

    @Reference(policy = ReferencePolicy.DYNAMIC, cardinality = ReferenceCardinality.OPTIONAL_UNARY)
    private volatile EventAdmin eventAdmin;

    @Reference(cardinality = ReferenceCardinality.OPTIONAL_UNARY, policy = ReferencePolicy.DYNAMIC)
    private ResourceResolverFactory resourceResolverFactory;

    private Map<String, Object> properties;
    private String slingMountPoint;
    private String fsMountPoint;
    private FileMonitor monitor;

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
                    // ignore
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
        } catch(Exception e) {}
        return null;
    }

    public String getSlingMountPoint() {
        return slingMountPoint;
    }

    public String getFsMountPoint() {
        return fsMountPoint;
    }

    public Map<String, Object> getProperties() {
        return properties;
    }

    public EventAdmin getEventAdmin() {
        return eventAdmin;
    }

    protected void activate(Map<String, Object> properties) {
        this.properties = properties;
        slingMountPoint = (String) properties.get(SLING_MOUNT_POINT);
        fsMountPoint = (String) properties.get(FS_MOUNT_POINT);
        long checkoutInterval = (Long) properties.get(CHECKOUT_INTERVAL);
        if(checkoutInterval >= DEFAULT_CHECKOUT_INTERVAL) {
            monitor = new FileMonitor(this, checkoutInterval);
        }
    }

    protected void deactivate() {
        synchronized(monitor) {
            if(monitor != null) {
                monitor.stop();
            }
        }
    }
}
