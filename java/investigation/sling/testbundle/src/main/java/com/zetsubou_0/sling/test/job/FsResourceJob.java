package com.zetsubou_0.sling.test.job;

import com.zetsubou_0.sling.test.modifyingresourceprovider.CustomSlingConstants;
import org.apache.felix.scr.annotations.*;
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
//@Properties({
//        @Property(name = JobConsumer.PROPERTY_TOPICS, value = {CustomSlingConstants.TOPIC_RESOURCE_ADD_JOB, CustomSlingConstants.TOPIC_RESOURCE_REMOVE_JOB})
        @Property(name = JobConsumer.PROPERTY_TOPICS, value = CustomSlingConstants.TOPIC_RESOURCE_ADD_JOB)
//})
public class FsResourceJob implements JobConsumer {
    private static final Logger LOG = LoggerFactory.getLogger(FsResourceJob.class);

    @Reference(cardinality= ReferenceCardinality.OPTIONAL_UNARY, policy=ReferencePolicy.DYNAMIC)
    private ResourceResolverFactory resourceResolverFactory;

//    @Activate
//    protected void activate() {
//        LOG.debug("activate");
//    }

    @Override
    public JobResult process(Job job) {
        ResourceResolver resourceResolver = null;
        try {
            resourceResolver = resourceResolverFactory.getAdministrativeResourceResolver(null);
            String topic = job.getTopic();
            final Resource resource = (Resource) job.getProperty(CustomSlingConstants.RESOURCE);
            final Map<String, Object> properties = new HashMap<>();
            if(CustomSlingConstants.TOPIC_RESOURCE_ADD.equals(topic)) {
                resourceResolver.create(resource.getParent(), resource.getName(), properties);
                resourceResolver.commit();
            } else if(CustomSlingConstants.TOPIC_RESOURCE_REMOVE.equals(topic)) {
                resourceResolver.delete(resource);
                resourceResolver.commit();
            }else {
                return JobResult.FAILED;
            }
        } catch (LoginException | PersistenceException e) {
            LOG.error(e.getMessage(), e);
            return JobResult.FAILED;
        }
        return JobResult.OK;
    }
}
