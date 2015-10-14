package com.zetsubou_0.sling.test2.observer;

import com.zetsubou_0.sling.test2.FsResourceProvider;
import com.zetsubou_0.sling.test2.helper.FsHelper;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.SlingConstants;
import org.apache.sling.api.resource.ModifyingResourceProvider;
import org.apache.sling.event.jobs.Job;
import org.apache.sling.event.jobs.JobManager;
import org.osgi.service.event.Event;
import org.osgi.service.event.EventConstants;
import org.osgi.service.event.EventHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Kiryl_Lutsyk on 10/13/2015.
 */
@Component(immediate = true)
@Service(value = EventHandler.class)
@Property(name = EventConstants.EVENT_TOPIC, value = SlingConstants.TOPIC_RESOURCE_ADDED)
public class ResourceCreateHandler implements ResourceHandler {
    private static final Logger LOG = LoggerFactory.getLogger(ResourceCreateHandler.class);

    @Reference(target = "(serviceName=" + FsResourceProvider.COMPONENT_NAME + ")")
    private ModifyingResourceProvider resourceProvider;
    @Reference(cardinality= ReferenceCardinality.OPTIONAL_UNARY, policy=ReferencePolicy.DYNAMIC)
    private JobManager jobManager;

    @Override
    public void handleEvent(Event event) {
        if(FsHelper.checkEvent(event, (String) ((FsResourceProvider) resourceProvider).getProperties().get(FsResourceProvider.SLING_MOUNT_POINT))) {
            File file = (File) event.getProperty(FsHelper.FILE);
            LOG.debug(event.getTopic() + " - " + file.getPath());
            Map<String, Object> properties = new HashMap<>();
            properties.put(SlingConstants.PROPERTY_PATH, event.getProperty(SlingConstants.PROPERTY_PATH));
            properties.put(FsHelper.FILE, event.getProperty(FsHelper.FILE));
            Job job = jobManager.addJob(CREATE_JOB, null, properties);
            LOG.debug("Job: " + " - " + job + " - " + file.getPath());
        }
    }
}
