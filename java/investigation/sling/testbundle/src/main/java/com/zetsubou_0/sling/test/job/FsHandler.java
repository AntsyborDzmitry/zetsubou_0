package com.zetsubou_0.sling.test.job;

import com.zetsubou_0.sling.test.modifyingresourceprovider.CustomSlingConstants;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.SlingConstants;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.event.jobs.JobManager;
import org.osgi.service.event.Event;
import org.osgi.service.event.EventConstants;
import org.osgi.service.event.EventHandler;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Kiryl_Lutsyk on 10/8/2015.
 */
@Component(immediate = true)
@Service
@Properties({
        @Property(name = EventConstants.EVENT_TOPIC, value = {CustomSlingConstants.TOPIC_RESOURCE_ADD, CustomSlingConstants.TOPIC_RESOURCE_REMOVE})
})
public class FsHandler implements EventHandler {
    @Reference(cardinality= ReferenceCardinality.OPTIONAL_UNARY, policy=ReferencePolicy.DYNAMIC)
    private JobManager jobManager;

    @Override
    public void handleEvent(Event event) {
        String topic = event.getTopic();
        final String resourceType = (String) event.getProperty(SlingConstants.PROPERTY_RESOURCE_TYPE);
        final String path = (String) event.getProperty(SlingConstants.PROPERTY_PATH);
        final Resource resource = (Resource) event.getProperty(CustomSlingConstants.RESOURCE);
        Map<String, Object> properties = new HashMap<>();
//        properties.put(SlingConstants.PROPERTY_RESOURCE_TYPE, resourceType);
//        properties.put(SlingConstants.PROPERTY_PATH, path);
//        properties.put(CustomSlingConstants.RESOURCE, resource);
        if(CustomSlingConstants.TOPIC_RESOURCE_ADD.equals(topic)) {
            jobManager.addJob(CustomSlingConstants.TOPIC_RESOURCE_ADD_JOB, FsHandler.class.getName(), properties);
//        } else if(CustomSlingConstants.TOPIC_RESOURCE_REMOVE.equals(topic)) {
//            jobManager.addJob(CustomSlingConstants.TOPIC_RESOURCE_REMOVE_JOB, null, properties);
        }
    }
}
