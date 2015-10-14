package com.zetsubou_0.sling.test2;

import com.zetsubou_0.sling.test2.monitor.FileMonitor;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.*;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.SlingConstants;
import org.apache.sling.api.resource.*;
import org.osgi.service.event.EventAdmin;

import javax.servlet.http.HttpServletRequest;
import java.io.*;
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
@Service(ModifyingResourceProvider.class)
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
        return resourceResolver.getResource(s);
    }

    @Override
    public Iterator<Resource> listChildren(Resource resource) {
        return null;
    }

    @Override
    public Resource create(ResourceResolver resourceResolver, String path, Map<String, Object> properties) throws PersistenceException {
        Resource resource = null;
        String fsBase = ((String) this.properties.get(FS_MOUNT_POINT)).replace("\\", "/");
        String slingBase = (String) this.properties.get(SLING_MOUNT_POINT);
        String resourceType = (String) properties.get(SlingConstants.PROPERTY_RESOURCE_TYPE);
        path = path.replace("\\", "/");

        // find resource
        File file = new File(path);
        // from file
        if(file != null) {
            String filePath = file.getPath().replace("\\", "/");
            if(!filePath.startsWith(fsBase)) {
                return null;
            }
            // in repository
            String resourcePath = slingBase + filePath.replace(fsBase, StringUtils.EMPTY);
            resource = ResourceUtil.getOrCreateResource(resourceResolver, resourcePath, properties, JcrConstants.NT_UNSTRUCTURED, true);
        } else {
            // in repository
            StringBuilder filePath = new StringBuilder();
            String relPath = null;
            if(path.startsWith(slingBase)) {
                resource = ResourceUtil.getOrCreateResource(resourceResolver, path, properties, JcrConstants.NT_UNSTRUCTURED, true);
                relPath = path.replace(slingBase, StringUtils.EMPTY);
            // wrong absolute path
            } else if(path.startsWith("/")) {
                throw new PersistenceException("Validation exception. invalid path: " + path);
            // relative path in repository
            } else {
                resource = ResourceUtil.getOrCreateResource(resourceResolver, slingBase + path, properties, JcrConstants.NT_UNSTRUCTURED, true);
                relPath = path;
            }

            // create file path
            if(fsBase.endsWith("/")) {
                if(relPath.startsWith("/")) {
                    filePath.append(fsBase.substring(1));
                } else {
                    filePath.append(fsBase);
                }
                filePath.append(relPath);
            } else if(relPath.startsWith("/")) {
                filePath.append(fsBase);
                filePath.append(relPath);
            } else {
                filePath.append(fsBase);
                filePath.append("/");
                filePath.append(relPath);
            }

            resourceType = (StringUtils.isNotBlank(resourceType)) ? resourceType : resource.getResourceType();

            File f = new File(filePath.toString());
            if(JcrConstants.NT_FILE.equals(resourceType)) {
                try(FileOutputStream out = new FileOutputStream(f)) {
                    out.close();
                } catch (IOException e) {
                    throw new PersistenceException(e.getMessage(), e);
                }
            } else {
                f.mkdirs();
            }
        }

        return resource;
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

    public Map<String, Object> getProperties() {
        return properties;
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
