package com.dhl.services.dao;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;

/**
 * Contains all methods, that are common to all rest services in CQ with jcr repo
 */
@Component
@Service(SlingDao.class)
public class SlingDaoImpl implements SlingDao {
    private static final Logger LOG = LoggerFactory.getLogger(SlingDaoImpl.class);

    private static final ThreadLocal<ResourceResolver> resourceStore = new ThreadLocal<>();
    private static final ThreadLocal<Session> sessionStore = new ThreadLocal<>();

    @Reference
    private ResourceResolverFactory resolverFactory;

    public SlingDaoImpl() {
        //should be empty
    }
    
    /**
     * For unit tests only
     */
    SlingDaoImpl(ResourceResolverFactory resolverFactory) {
        this.resolverFactory = resolverFactory;
    }

    private ResourceResolver getResourceResolver() {
        if (resourceStore.get() == null) {
            LOG.debug("Opening JCR session");
            ResourceResolver resourceResolver;
            try {
                // each time returns new instance
                resourceResolver = resolverFactory.getAdministrativeResourceResolver(null);
            } catch (LoginException e) {
                throw new IllegalStateException("Unexpected exception while getting admin session", e);
            }
            resourceStore.set(resourceResolver);
        }
        return resourceStore.get();
    }

    private Session getSession() {
        if (sessionStore.get() == null) {
            Session session = getResourceResolver().adaptTo(Session.class);
            sessionStore.set(session);
        }
        return sessionStore.get();
    }
    
    @Override
    public Resource getResource(String jcrPath) throws RepositoryException {
        return getResourceResolver().getResource(jcrPath);
    }

    @Override
    public Node getNode(String jcrPath) throws RepositoryException {
        return getSession().getNode(jcrPath);
    }

    @Override
    public List<Node> getNodes(String jcrPath) throws RepositoryException {
        Node targetNode = getSession().getNode(jcrPath);
        NodeIterator childNodes = targetNode.getNodes();
        List<Node> nodes = new ArrayList<>((int)childNodes.getSize());
        while (childNodes.hasNext()) {
            nodes.add((Node) childNodes.next());
        }
        return Collections.unmodifiableList(nodes);
    }

    @Override
    public boolean isNodeExists(String jcrPath) throws RepositoryException {
        Session session = getSession();
        return session.nodeExists(jcrPath);
    }

    @Override
    public List<String> listNodeTags(String jcrPath) {
        ResourceResolver resourceResolver = getResourceResolver();
        TagManager tagManager = resourceResolver.adaptTo(TagManager.class);
        Resource resource = resourceResolver.getResource(jcrPath);
        Tag[] tags = tagManager.getTags(resource);
        List<String> result = new ArrayList<>(tags.length);
        for (Tag tag : tags) {
            result.add(tag.getName());
        }
        return Collections.unmodifiableList(result);
    }

    @Override
    public String getNodeProperty(Node node, String key) throws RepositoryException {
        return node.getProperty(key).getValue().getString();
    }

    @Override
    public void saveSession() throws RepositoryException {
        Session session = sessionStore.get();
        if (session != null) {
            LOG.debug("Saving session to JCR");
            session.save();
        }
    }

    @Override
    public void closeSession() {
        Session session = sessionStore.get();
        if (session != null) {
            LOG.debug("Closing session to JCR");
            session.logout();
            sessionStore.remove();
        }

        ResourceResolver resourceResolver = resourceStore.get();
        if (resourceResolver != null) {
            resourceResolver.close();
            resourceStore.remove();
        }
    }
}