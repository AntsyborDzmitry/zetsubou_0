package com.zetsubou_0.cq.test.workflow.servlet;

import com.adobe.granite.workflow.WorkflowException;
import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.model.WorkflowModel;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.WCMException;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestPathInfo;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 10/21/2015.
 */
@SlingServlet(
        resourceTypes = {"sling/servlet/default"},
        selectors = {ModelManipulate.CREATE, ModelManipulate.DELETE, ModelManipulate.INFO},
        extensions = {"workflow"}
)
public class ModelManipulate extends SlingAllMethodsServlet {
    public static final String CREATE = "createModel";
    public static final String DELETE = "deleteModel";
    public static final String INFO = "info";

    private static final String modelRepo = "/etc/workflow/models";
    private static final String modelTemplate = "/libs/cq/workflow/templates/model";
    private static final String modelName = "test_model_1";
    private static final String modelTitle = "Test back-end model 1";
    private static final String modelPostfix = "/jcr:content/model";

    private static final Logger LOG = LoggerFactory.getLogger(ModelManipulate.class);

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        RequestPathInfo requestPathInfo = request.getRequestPathInfo();
        WorkflowSession workflowSession = request.getResourceResolver().adaptTo(WorkflowSession.class);
        PageManager pageManager = request.getResourceResolver().adaptTo(PageManager.class);
        if(pageManager != null && workflowSession != null) {
            for(String selector : requestPathInfo.getSelectors()) {
                if(CREATE.equals(selector)) {
                    // String parentPath, String pageName, String template, String title
                    try {
                        Page page = pageManager.create(modelRepo, modelName, modelTemplate, modelTitle);
                        WorkflowModel model = workflowSession.createNewModel("Made using Java", getID());
                        LOG.debug("{}", model);
                    } catch (WCMException | WorkflowException e) {
                        throw new ServletException(e);
                    }
                } else if(DELETE.equals(selector)) {
                    try {
                        workflowSession.deleteModel(getID());
                    } catch (WorkflowException e) {
                        throw new ServletException(e);
                    }
                } else if(INFO.equals(selector)) {
                }
            }
        }
    }

    private String getID() {
        StringBuilder sb = new StringBuilder();
        sb.append(modelRepo);
        sb.append("/");
        sb.append(modelName);
        sb.append(modelPostfix);
        return sb.toString();
    }
}
