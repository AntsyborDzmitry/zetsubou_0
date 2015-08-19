package com.zetsubou_0.jcr.listeners;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.observation.Event;
import javax.jcr.observation.EventIterator;
import javax.jcr.observation.EventListener;
import java.text.SimpleDateFormat;

/**
 * Created by Kiryl_Lutsyk on 8/17/2015.
 */
public class JcrListener implements EventListener {
    private static final Logger LOG = LoggerFactory.getLogger(EventListener.class);

    public static final String PATH = "/content/store";
    public static final String NAME = "name";
    public static final String COUNT = "count";
    public static final String DATE = "date";
    public static final String PATTERN = "MMMM";
    public static final String NODE_TYPE = "jte:testEntity";
    public static final String NODE_NAME_PATTERN = "/[0-9]*";

    private Session session;

    public JcrListener(Session session) {
        this.session = session;
    }

    @Override
    public void onEvent(EventIterator eventIterator) {
        while(eventIterator.hasNext()) {
            Event event = eventIterator.nextEvent();
            if(event.getType() == Event.NODE_ADDED) {
                try {
                    String path = event.getPath();
                    Node node = session.getNode(path);
                    if(path.split(PATH + NODE_NAME_PATTERN).length == 0) {
                        moveNode(node);
                    }
                } catch (RepositoryException e) {
                    LOG.error(e.getMessage(), e);
                }
            }
        }
    }

    private void moveNode(Node node) throws RepositoryException {
        SimpleDateFormat sdf = new SimpleDateFormat(PATTERN);
        if(node.hasProperty(DATE)) {
            Property property = node.getProperty(DATE);
            if(property != null) {
                Node root = session.getNode(PATH);
                String newPath = sdf.format(property.getDate().getTime());
                if(!root.hasNode(newPath)) {
                    root.addNode(newPath);
                }

                Node store = root.getNode(newPath);
                String path = node.getName();
                if(!store.hasNode(path)) {
                    Node newNode = store.addNode(path, NODE_TYPE);
                    if(node.hasProperty(NAME)) {
                        property = node.getProperty(NAME);
                        if(property != null) {
                            newNode.setProperty(NAME, property.getString());
                        }
                    }
                    if(node.hasProperty(DATE)) {
                        property = node.getProperty(DATE);
                        if(property != null) {
                            newNode.setProperty(DATE, property.getDate());
                        }
                    }
                    if(node.hasProperty(COUNT)) {
                        property = node.getProperty(COUNT);
                        if(property != null) {
                            newNode.setProperty(COUNT, property.getLong());
                        }
                    }
                }

                node.remove();
                session.save();
            }
        }
    }
}
