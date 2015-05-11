package com.zetsubou_0.test.observer;

import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Deactivate;
import org.apache.felix.scr.annotations.Reference;
import org.apache.sling.jcr.api.SlingRepository;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.observation.Event;
import javax.jcr.observation.EventIterator;
import javax.jcr.observation.EventListener;

@Component
public class JcrInheritParagraph implements EventListener {
    private static final Logger LOG = LoggerFactory.getLogger(JcrInheritParagraph.class);
    private static final String PATH = "/content/test/inh-par";
    private static final String SLING_TYPE = "sling:resourceType";
    private static final String JCR_CONTENT = "jcr:content";

    private Session adminSession;

    @Reference
    private SlingRepository repository;

    @Activate
    public void activate(ComponentContext context) throws Exception {
        LOG.info("activating ExampleObservation");
        try {
            adminSession = repository.loginAdministrative(null);
            adminSession.getWorkspace().getObservationManager().addEventListener(
                this, // handler (this)
                Event.PROPERTY_ADDED, // event types
                PATH, // path
                true, // is Deep?
                null, // uuids filter
                null, // nodetypes filter
                false);
        } catch (RepositoryException e){
            LOG.error("unable to register session", e);
            throw new Exception(e);
        }
    }

    @Deactivate
    public void deactivate(){
        if (adminSession != null){
            adminSession.logout();
        }
    }

    @Override
    public void onEvent(EventIterator eventIterator) {
        // root node
        Node rootNode = null;
        try {
            rootNode = adminSession.getNode(PATH + "/" + JCR_CONTENT);
            while (eventIterator.hasNext()) {
                try {
                    String eventPath = eventIterator.nextEvent().getPath();
                    // find resource type
                    if(eventPath.endsWith(SLING_TYPE)) {
                        // sling:resourceType of added node
                        String type = adminSession.getProperty(eventPath).getString();

                        NodeIterator iterator = rootNode.getNodes();
                        while(iterator.hasNext()) {
                            Node child = iterator.nextNode();
                            if(StringUtils.equals(type, child.getProperty(SLING_TYPE).getString())) {
                                removeNode();
                            }
                        }
                    }
                } catch (RepositoryException e) {
                    LOG.error(e.getMessage(), e);
                }
            }
        } catch (RepositoryException e) {
            LOG.error(e.getMessage(), e);
        }
    }

    private void removeNode() {
        // todo: remove saved node
    }
}
