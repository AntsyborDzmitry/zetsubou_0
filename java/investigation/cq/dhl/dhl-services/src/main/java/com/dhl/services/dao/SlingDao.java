package com.dhl.services.dao;

import javax.jcr.Node;
import javax.jcr.RepositoryException;

import org.apache.sling.api.resource.Resource;

import java.util.List;

/**
 * DAO for JCR repository
 * Each of method opening the session, so after using them you need to close the session with {@link #closeSession()}
 */
public interface SlingDao {
    String DEFAULT_DICTIONARY_PATH = "/apps/dhl/i18n/";
    String SLING_KEY_PROPERTY_KEY = "sling:key";
    String SLING_MESSAGE_PROPERTY_KEY = "sling:message";
    String CONTENT = "jcr:content";

    /**
     * Read list of nodes (of given the absolute folder path) from the repository.
     *
     * @param jcrPath path to nodes' parent
     * @return node list
     * @throws RepositoryException
     */
    List<Node> getNodes(String jcrPath) throws RepositoryException;
    
    /**
     * Returns node by JCR path from the repository.
     *
     * @param jcrPath path to node
     * @return node
     * @throws RepositoryException
     */
    Node getNode(String jcrPath) throws RepositoryException;
    
    /**
     * Returns Sling resource from the repository.
     *
     * @param jcrPath path to node
     * @return node
     * @throws RepositoryException
     */
    Resource getResource(String jcrPath) throws RepositoryException;

    /**
     * Verify if particular node exists
     *
     * @param jcrPath path to node
     * @return true if node exists, false otherwise
     * @throws RepositoryException
     */
    boolean isNodeExists(String jcrPath) throws RepositoryException;
    
    /**
     * returns array of tags for the jcr node
     *
     * @param jcrPath of requested node
     * @return tags associated with jcr node
     */
    List<String> listNodeTags(String jcrPath);

    /**
     * Return node's property value stored by `key` like node[key]
     * @param node target node
     * @param key property key
     * @return property value
     * @throws RepositoryException
     */
    String getNodeProperty(Node node, String key) throws RepositoryException;

    /**
     * Save admin session
     * @throws RepositoryException
     */
    void saveSession() throws RepositoryException;

    /**
     * Close admin session
     */
    void closeSession();

}