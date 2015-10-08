package com.zetsubou_0.sling.test.job;

import com.zetsubou_0.sling.test.modifyingresourceprovider.CustomSlingConstants;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.event.jobs.Job;
import org.apache.sling.event.jobs.consumer.JobConsumer;

/**
 * Created by Kiryl_Lutsyk on 10/8/2015.
 */
@Component
@Service
//@Property(name = JobConsumer.PROPERTY_TOPICS, value = CustomSlingConstants.TOPIC_RESOURCE_ADD_JOB)
public class JobConsumerTest implements JobConsumer {
    @Override
    public JobResult process(Job job) {
        return JobResult.OK;
    }
}
