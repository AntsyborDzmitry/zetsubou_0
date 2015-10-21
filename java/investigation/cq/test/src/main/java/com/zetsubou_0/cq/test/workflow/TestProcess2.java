package com.zetsubou_0.cq.test.workflow;

import com.adobe.granite.workflow.WorkflowException;
import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.exec.WorkflowProcess;
import com.adobe.granite.workflow.metadata.MetaDataMap;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by Kiryl_Lutsyk on 10/21/2015.
 */
@Component
@Service
public class TestProcess2 implements WorkflowProcess {
    private static final Logger LOG = LoggerFactory.getLogger(TestProcess2.class);

    @Property(value = "Test process 2")
    private static final String LABEL = "process.label";

    private static final String PATH = "/content/tmp";

    @Override
    public void execute(WorkItem workItem, WorkflowSession workflowSession, MetaDataMap metaDataMap) throws WorkflowException {
        String path = (String) workItem.getWorkflowData().getPayload();
        if(StringUtils.isNotBlank(path) && path.contains(PATH)) {
            ResourceResolver resourceResolver = workflowSession.adaptTo(ResourceResolver.class);
            Resource resource = resourceResolver.getResource("/content/fs/toDelete");
        }

    }
}
