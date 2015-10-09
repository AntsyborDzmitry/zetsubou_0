package com.zetsubou_0.sling.test.job;

import com.zetsubou_0.sling.test.modifyingresourceprovider.CustomSlingConstants;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.SlingConstants;
import org.apache.sling.api.resource.*;
import org.apache.sling.event.jobs.Job;
import org.apache.sling.event.jobs.consumer.JobConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Kiryl_Lutsyk on 10/8/2015.
 */
@Component
@Service(value = {JobConsumer.class})
@Properties({
        @Property(name = JobConsumer.PROPERTY_TOPICS, value = {CustomSlingConstants.TOPIC_RESOURCE_ADD_JOB, CustomSlingConstants.TOPIC_RESOURCE_REMOVE_JOB})
//        @Property(name = JobConsumer.PROPERTY_JOB_ASYNC_HANDLER),
//        @Property(name = JobConsumer.PROPERTY_TOPICS, value = CustomSlingConstants.TOPIC_RESOURCE_ADD_JOB)
})
public class FsResourceJob implements JobConsumer {
    private static final Logger LOG = LoggerFactory.getLogger(FsResourceJob.class);

    @Reference(cardinality= ReferenceCardinality.OPTIONAL_UNARY, policy=ReferencePolicy.DYNAMIC)
    private ResourceResolverFactory resourceResolverFactory;

    @Override
    public JobResult process(Job job) {
        try {
            ResourceResolver resourceResolver = resourceResolverFactory.getAdministrativeResourceResolver(null);
            if(resourceResolver != null) {
                String topic = job.getTopic();
                final String resourceType = (String) job.getProperty(SlingConstants.PROPERTY_RESOURCE_TYPE);
                final String parentPath = (String) job.getProperty(CustomSlingConstants.PARENT_RESOURCE_PATH);
                final String path = (String) job.getProperty(SlingConstants.PROPERTY_PATH);
                final String fsPath = (String) job.getProperty(CustomSlingConstants.FS_PATH);
                final String name = (String) job.getProperty(CustomSlingConstants.NAME);
                final Map<String, Object> properties = new HashMap<>();
                properties.put(SlingConstants.PROPERTY_RESOURCE_TYPE, resourceType);
                properties.put(CustomSlingConstants.FS_PATH, fsPath);
                if(CustomSlingConstants.TOPIC_RESOURCE_ADD_JOB.equals(topic)) {
                    Resource parent = resourceResolver.getResource(parentPath);
                    resourceResolver.create(parent, name, properties);
                    resourceResolver.commit();
                } else if(CustomSlingConstants.TOPIC_RESOURCE_REMOVE_JOB.equals(topic)) {
                    Resource resource = resourceResolver.getResource(path);
                    resourceResolver.delete(resource);
                    resourceResolver.commit();
                }else {
                    return JobResult.FAILED;
                }
            }
        } catch (LoginException | PersistenceException e) {
            LOG.error(e.getMessage(), e);
            return JobResult.FAILED;
        }
        return JobResult.OK;
    }
}
