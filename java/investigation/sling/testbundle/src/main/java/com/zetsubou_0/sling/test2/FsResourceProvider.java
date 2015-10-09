package com.zetsubou_0.sling.test2;

import com.zetsubou_0.sling.test2.monitor.FileMonitor;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceProvider;
import org.apache.sling.api.resource.ResourceResolver;

import javax.servlet.http.HttpServletRequest;
import java.util.Iterator;
import java.util.Map;

/**
 * Created by Kiryl_Lutsyk on 10/9/2015.
 */
@Component(
        name = "com.zetsubou_0.sling.test2.FsResourceProvider",
        label="%resource.resolver.name",
        description="%resource.resolver.description",
        configurationFactory=true,
        policy= ConfigurationPolicy.REQUIRE,
        metatype=true
)
@Service(ResourceProvider.class)
@Properties({
        @Property(name="service.description", value="Test Filesystem Resource Provider"),
        @Property(name="service.vendor", value="Test"),
        @Property(name=ResourceProvider.ROOTS)
})
public class FsResourceProvider implements ResourceProvider {
    @Property
    public static final String SLING_MOUNT_POINT = "provider.mount.sling";
    @Property
    public static final String FS_MOUNT_POINT = "provider.mount.fs";
    @Property(longValue = DEFAULT_CHECKOUT_INTERVAL)
    public static final String CHECKOUT_INTERVAL = "provider.checkOut.interval";

    public static final String DEFAULT_SLING_MOUNT_POINT = "";
    public static final String DEFAULT_FS_MOUNT_POINT = "";
    public static final long DEFAULT_CHECKOUT_INTERVAL = 1000;

    private double checkoutInterval;

    @Override
    public Resource getResource(ResourceResolver resourceResolver, HttpServletRequest httpServletRequest, String s) {
        return null;
    }

    @Override
    public Resource getResource(ResourceResolver resourceResolver, String s) {
        return null;
    }

    @Override
    public Iterator<Resource> listChildren(Resource resource) {
        return null;
    }

    protected void activate(Map<?, ?> properties) {
        long checkoutInterval = (long) properties.get(CHECKOUT_INTERVAL);
        if(checkoutInterval > 1000) {
            FileMonitor monitor = new FileMonitor(this, checkoutInterval);
            new Thread(monitor).start();
        }
    }

    protected void deactivate() {

    }
}
