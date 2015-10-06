package com.zetsubou_0.sling.operation;

import org.apache.felix.scr.annotations.*;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.servlets.post.*;

import javax.jcr.*;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.util.Calendar;
import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 10/6/2015.
 */
@Component(immediate = true)
@Service(value = PostOperation.class)
@org.apache.felix.scr.annotations.Property(name=PostOperation.PROP_OPERATION_NAME, value="slingTestContent")
public class Content extends AbstractPostOperation {
    private static final String PREFIX = "page-%s";
    private static final String CONTENT_ROOT = "/content";
    private static final String BUNDLE = "/content/system/target/sling-operation-content-1.0-SNAPSHOT.jar";

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

            Resource jar = slingHttpServletRequest.getResourceResolver().getResource(BUNDLE);
            File file = jar.adaptTo(File.class);
            if(file != null) {
                try {
                    ValueFactory valueFactory = session.getValueFactory();
                    Node fileContainer = jcrContent.addNode(file.getName(), JcrConstants.NT_FILE);
                    Node fileContent = fileContainer.addNode(JcrConstants.JCR_CONTENT, JcrConstants.NT_RESOURCE);
                    Calendar lastModified = Calendar.getInstance ();
                    lastModified.setTimeInMillis (file.lastModified ());
                    BufferedInputStream in = new BufferedInputStream(new FileInputStream(file));
                    fileContent.setProperty(JcrConstants.JCR_DATA, valueFactory.createBinary(in));
                    fileContent.setProperty(JcrConstants.JCR_LASTMODIFIED, lastModified);
                    session.save();
                } catch (java.io.IOException e) {
                    log.error(e.getMessage(), e);
                }
            }
        }
    }
}
