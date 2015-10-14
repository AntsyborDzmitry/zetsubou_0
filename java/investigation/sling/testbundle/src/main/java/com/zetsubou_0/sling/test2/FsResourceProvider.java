package com.zetsubou_0.sling.test2;

import com.zetsubou_0.sling.test2.monitor.FileMonitor;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.resource.*;
import org.osgi.service.event.EventAdmin;

import javax.servlet.http.HttpServletRequest;
import java.util.Iterator;
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
@Service(ResourceProvider.class)
@Properties({
        @Property(name = "serviceName", value = FsResourceProvider.COMPONENT_NAME, propertyPrivate = true),
        @Property(name="service.description", value="Test Filesystem Resource Provider"),
        @Property(name="service.vendor", value="Test")
})
public class FsResourceProvider implements ModifyingResourceProvider {
    public static final String COMPONENT_NAME = "com.zetsubou_0.sling.test2.FsResourceProvider";
    public static final String DEFAULT_SLING_MOUNT_POINT = "/content/fileSystem";
    public static final String DEFAULT_FS_MOUNT_POINT = "d:/temp/00";
    public static final long DEFAULT_CHECKOUT_INTERVAL = 60000L;

    /**
     * Mount point into sling repository
     */
    @Property(value = DEFAULT_SLING_MOUNT_POINT)
    public static final String SLING_MOUNT_POINT = "provider.mount.sling";
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

    private String slingMountPoint;
    private String fsMountPoint;
    private FileMonitor monitor;

    @Override
    public Resource getResource(ResourceResolver resourceResolver, HttpServletRequest httpServletRequest, String s) {
        return getResource(resourceResolver, s);
    }

    @Override
    public Resource getResource(ResourceResolver resourceResolver, String s) {
        return resourceResolver.getResource(s);
    }

    @Override
    public Iterator<Resource> listChildren(Resource resource) {
        return null;
    }

    @Override
    public Resource create(ResourceResolver resourceResolver, String s, Map<String, Object> map) throws PersistenceException {
        return null;
    }

    @Override
    public void delete(ResourceResolver resourceResolver, String s) throws PersistenceException {

    }

    @Override
    public void revert(ResourceResolver resourceResolver) {

    }

    @Override
    public void commit(ResourceResolver resourceResolver) throws PersistenceException {

    }

    @Override
    public boolean hasChanges(ResourceResolver resourceResolver) {
        return false;
    }

    public EventAdmin getEventAdmin() {
        return eventAdmin;
    }

    public String getSlingMountPoint() {
        return slingMountPoint;
    }

    public String getFsMountPoint() {
        return fsMountPoint;
    }

    protected void activate(Map<String, Object> properties) {
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
