package com.zetsubou_0.jcr.listeners;

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
    public static final String PATH = "/content/store";
    public static final String NAME = "name";
    public static final String COUNT = "count";
    public static final String DATE = "date";
    public static final String PATTERN = "MMMM";

    private Session session;

    public JcrListener(Session session) {
        this.session = session;
    }

    @Override
    public void onEvent(EventIterator eventIterator) {
        while(eventIterator.hasNext()) {
            Event event = eventIterator.nextEvent();
            try {
                String path = event.getPath();
                Node node = session.getNode(path);
                moveNode(node);
            } catch (RepositoryException e) {
                e.printStackTrace();
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
                    Node newNode = store.addNode(path);
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
                    session.save();
                }

                node.remove();
                session.save();
            }
        }
    }
}
