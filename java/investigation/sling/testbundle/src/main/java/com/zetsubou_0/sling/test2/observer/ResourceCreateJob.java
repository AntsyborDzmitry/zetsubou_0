package com.zetsubou_0.sling.test2.observer;

import com.zetsubou_0.sling.test2.FsResourceProvider;
import com.zetsubou_0.sling.test2.helper.FsHelper;
import org.apache.felix.scr.*;
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
import java.util.Dictionary;
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
    @Reference(cardinality = ReferenceCardinality.OPTIONAL_UNARY, policy = ReferencePolicy.DYNAMIC)
    private ScrService scrService;

    @Override
    public JobResult process(Job job) {
        try {
            FsResourceProvider resourceProvider = job.getProperty(FsHelper.PROVIDER, FsResourceProvider.class);
            ResourceResolver resourceResolver = resourceResolverFactory.getAdministrativeResourceResolver(null);
            File file =  job.getProperty(FsHelper.FILE, File.class);
            if(resourceProvider != null && file != null && resourceResolver != null && scrService != null) {
                LOG.debug("Process job.\nPath: " + file.getPath());
                org.apache.felix.scr.Component[] components = scrService.getComponents();
                for(org.apache.felix.scr.Component component : components) {
                    if(FsResourceProvider.class.getName().equals(component.getClassName())) {
                        String resourceType = file.isDirectory() ? JcrConstants.NT_FOLDER : JcrConstants.NT_FILE;
                        Dictionary<String, Object> componentProperties = component.getProperties();
                        String fsMountPoint = (String) componentProperties.get(FsResourceProvider.FS_MOUNT_POINT);
                        String slingMountPoint = (String) componentProperties.get(FsResourceProvider.SLING_MOUNT_POINT);
                        if(!fsMountPoint.endsWith("/")) {
                            fsMountPoint += "/";
                        }
                        String parentResourcePath = file.getPath().replace(fsMountPoint, "").concat("/");
                        Resource parent = resourceProvider.getResource(resourceResolver, slingMountPoint + parentResourcePath);
                        Map<String, Object> properties = new HashMap<>();
                        properties.put(SlingConstants.PROPERTY_RESOURCE_TYPE, resourceType);
                        resourceResolver.create(parent, file.getName(), properties);
                    }
                }
            }
        } catch (LoginException | PersistenceException e) {
            LOG.error(e.getMessage(), e);
            return JobResult.FAILED;
        }
        return JobResult.OK;
    }
}