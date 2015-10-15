package com.zetsubou_0.sling.test.observer;

import com.zetsubou_0.sling.test.FsResourceProvider;
import com.zetsubou_0.sling.test.helper.FsHelper;
import org.apache.felix.scr.annotations.*;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.SlingConstants;
import org.apache.sling.api.resource.*;
import org.apache.sling.event.jobs.Job;
import org.apache.sling.event.jobs.consumer.JobConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.HashMap;
import java.util.Map;


/**
 * Created by Kiryl_Lutsyk on 10/13/2015.
 */
@Component
@Service
@Property(name = JobConsumer.PROPERTY_TOPICS, value = ResourceHandler.CREATE_JOB)
public class ResourceCreateJob implements JobConsumer {
    private static final Logger LOG = LoggerFactory.getLogger(ResourceCreateJob.class);

    @Reference(cardinality = ReferenceCardinality.OPTIONAL_UNARY, policy = ReferencePolicy.DYNAMIC)
    private ResourceResolverFactory resourceResolverFactory;
    @Reference(target = "(serviceName=" + FsResourceProvider.COMPONENT_NAME + ")")
    private ModifyingResourceProvider resourceProvider;

    @Override
    public JobResult process(Job job) {
        try {
            ResourceResolver resourceResolver = resourceResolverFactory.getAdministrativeResourceResolver(null);
            File file = job.getProperty(FsHelper.FILE, File.class);
            String path = job.getProperty(SlingConstants.PROPERTY_PATH, String.class);
            if(resourceResolver != null) {
                Map<String, Object> properties = new HashMap<>();
                String s = null;
                if(file != null) {
                    String resourceType = file.isDirectory() ? JcrConstants.NT_FOLDER : JcrConstants.NT_FILE;
                    properties.put(SlingConstants.PROPERTY_RESOURCE_TYPE, resourceType);
                    s = file.getPath();
                } else {
                    properties.put(SlingConstants.PROPERTY_RESOURCE_TYPE, JcrConstants.NT_FOLDER);
                    s = path;
                }
                resourceProvider.create(resourceResolver, s, properties);
            }
        } catch (LoginException | PersistenceException e) {
            LOG.error(e.getMessage(), e);
            return JobResult.FAILED;
        }
        return JobResult.OK;
    }
}