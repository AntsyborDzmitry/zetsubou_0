package com.zetsubou_0.test.workflow.processstep;

import com.adobe.granite.workflow.WorkflowException;
import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.exec.WorkflowProcess;
import com.adobe.granite.workflow.metadata.MetaDataMap;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;
import org.osgi.framework.Constants;

/**
 * Created by Kiryl_Lutsyk on 9/28/2015.
 */
@Component
@Service
@Properties({@Property(name = Constants.SERVICE_DESCRIPTION, value = "Node create with postfix \"temp\""),
        @Property(name = Constants.SERVICE_VENDOR, value = "epam"),
        @Property(name = "process.label", value = "Create node with postfix")
})
public class NodeCreate implements WorkflowProcess {

    @Override
    public void execute(WorkItem workItem, WorkflowSession workflowSession, MetaDataMap metaDataMap) throws WorkflowException {
        System.out.println("started");
    }
}
