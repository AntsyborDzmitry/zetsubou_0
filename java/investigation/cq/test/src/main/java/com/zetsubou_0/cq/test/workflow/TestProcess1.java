package com.zetsubou_0.cq.test.workflow;

import com.adobe.granite.workflow.WorkflowException;
import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.Route;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.exec.WorkflowProcess;
import com.adobe.granite.workflow.metadata.MetaDataMap;
import com.day.cq.workflow.collection.ResourceCollectionManager;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Value;
import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 10/21/2015.
 */
@Component
@Service
public class TestProcess1 implements WorkflowProcess {
    private static final Logger LOG = LoggerFactory.getLogger(TestProcess1.class);

    @Property(value = "Test process 1")
    private static final String LABEL = "process.label";

    private static final String PATH = "/content/tmp";

    @Reference
    private ResourceCollectionManager resourceCollectionManager;

    @Override
    public void execute(WorkItem workItem, WorkflowSession workflowSession, MetaDataMap metaDataMap) throws WorkflowException {
        try {
            if(workItem.getWorkflowData().getPayloadType().equals("JCR_PATH")) {
                String path = (String) workItem.getWorkflowData().getPayload();
                if(StringUtils.isNotBlank(path) && path.contains(PATH)) {
                    Session session = workflowSession.adaptTo(Session.class);
                    Node created = session.getNode(path);
                    if(created != null) {
                        int i = 0;
                        for(Value val : (Value[]) metaDataMap.get("data")) {
                            created.setProperty("data-" + ++i, val.getString());
                        }
                    }
                    session.save();
                }

                // add metadata to next step
                MetaDataMap map = workItem.getWorkflow().getMetaDataMap();
                map.put("y", "y");
                map.put("PROCESS_AUTO_ADVANCE", true);

                // get all routes
                List<Route> routes = workflowSession.getRoutes(workItem, true);
                LOG.debug(routes.toString());
                if(routes.size() > 0) {
                    workflowSession.complete(workItem, routes.get(0));
                }
            }
        } catch(ClassCastException | RepositoryException e) {
            LOG.error(e.getMessage(), e);
        }


    }
}
