package com.zetsubou_0.sling.test.modifyingresourceprovider.monitor;

import com.zetsubou_0.sling.test.modifyingresourceprovider.CustomFsResource;
import com.zetsubou_0.sling.test.modifyingresourceprovider.CustomSlingConstants;
import org.apache.sling.api.SlingConstants;
import org.apache.sling.api.resource.ModifyingResourceProvider;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.event.Event;
import org.osgi.service.event.EventAdmin;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Created by Kiryl_Lutsyk on 10/7/2015.
 */
public class CustomFsMonitor implements Runnable {
    private static final Logger LOG = LoggerFactory.getLogger(CustomFsMonitor.class);

    private final CustomFsMonitor lock;

    private final EventAdmin eventAdmin;
    private final ResourceResolver resourceResolver;
    private final ModifyingResourceProvider modifyingResourceProvider;

    public CustomFsMonitor(EventAdmin eventAdmin, ResourceResolver resourceResolver, ModifyingResourceProvider modifyingResourceProvider) {
        this.eventAdmin = eventAdmin;
        this.resourceResolver = resourceResolver;
        this.modifyingResourceProvider = modifyingResourceProvider;
        this.lock = this;
    }

    @Override
    public void run() {
        try {
            resourceManipulate(modifyingResourceProvider.getResource(resourceResolver, "/"), CustomSlingConstants.TOPIC_RESOURCE_ADD);
            TimeUnit.MINUTES.sleep(1);
            resourceManipulate(modifyingResourceProvider.getResource(resourceResolver, "/"), CustomSlingConstants.TOPIC_RESOURCE_REMOVE);
        } catch (Exception e) {
            LOG.error(e.getMessage(), e);
        }
    }

    public void stop() {
        synchronized(lock) {
            lock.notifyAll();
        }
    }

    private void resourceManipulate(Resource resource, String topic) throws Exception {
        final Map<String, Object> properties = new HashMap<>();
        if(resource != null) {
            properties.put(SlingConstants.PROPERTY_RESOURCE_TYPE, resource.getResourceType());
            properties.put(SlingConstants.PROPERTY_PATH, resource.getPath());
            properties.put(CustomSlingConstants.FS_PATH, ((CustomFsResource) resource).getFsPath());
            properties.put(CustomSlingConstants.NAME, resource.getName());
            properties.put(CustomSlingConstants.PARENT_RESOURCE_PATH, resource.getParent().getPath());
            eventAdmin.postEvent(new Event(topic, properties));
        }
    }

}
