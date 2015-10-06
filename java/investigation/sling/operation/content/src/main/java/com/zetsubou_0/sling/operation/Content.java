package com.zetsubou_0.sling.operation;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.servlets.post.*;

import javax.jcr.*;
import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 10/6/2015.
 */
@Component(immediate = true)
@Service(value = PostOperation.class)
@Property(name=PostOperation.PROP_OPERATION_NAME, value="slingTestContent")
public class Content extends AbstractPostOperation {
    private static final String PREFIX = "page-%s";
    private static final String CONTENT_ROOT = "/content";

    @Override
    protected void doRun(SlingHttpServletRequest slingHttpServletRequest, PostResponse postResponse, List<Modification> list) throws RepositoryException {
        Session session = slingHttpServletRequest.getResourceResolver().adaptTo(Session.class);
        Resource resource = slingHttpServletRequest.getResource();
        Node root = session.getNode(CONTENT_ROOT);
        Node resourceNode = resource.adaptTo(Node.class);
        String contentNodeName = String.format(PREFIX, resource.getName());
        if(root != null && resourceNode != null && !root.hasNode(contentNodeName)) {
            Node content = root.addNode(contentNodeName, resourceNode.getProperty(JcrConstants.JCR_PRIMARYTYPE).getString());
            Node jcrContent = content.addNode(JcrConstants.JCR_CONTENT);
            PropertyIterator iterator = resourceNode.getProperties();
            while(iterator.hasNext()) {
                javax.jcr.Property property = iterator.nextProperty();
                if(property.isMultiple()) {
                    jcrContent.setProperty(property.getName(), property.getValues(), property.getType());
                } else {
                    if(!JcrConstants.JCR_PRIMARYTYPE.equals(property.getName())) {
                        jcrContent.setProperty(property.getName(), property.getValue(), property.getType());
                    }
                }
            }
            session.save();
        }
    }
}
