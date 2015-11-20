package com.dhl.author.services.service;

import com.day.cq.commons.jcr.JcrUtil;
import com.dhl.services.dao.RepositoryRuntimeException;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.jcr.api.SlingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.*;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.jcr.query.QueryResult;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import com.dhl.services.service.JcrProps;

@Component
@Service(I18NHistoryService.class)
public class I18NHistoryServiceImpl implements I18NHistoryService {

    private static final String SESSION_ERROR = "error getting session";
    private static final Logger LOGGER = LoggerFactory.getLogger(I18NHistoryServiceImpl.class);

    @Reference
    private SlingRepository repository;

    /**
     * @Inheritdoc
     */
    @Override
    public Map<String, String> makeDictionaryVersion(String dictionaryPath, String versionName) {
        Session session = null;
        try {
            session = repository.loginAdministrative(null);
            Node langNode = session.getNode(dictionaryPath);
            Node vhNode = session.getNode(JcrProps.VERSION_PATH.getValue());
            Node copiedNode = JcrUtil.copy(langNode, vhNode, JcrUtil.escapeIllegalJcrChars(versionName));
            Node infoNode = copiedNode.addNode(JcrProps.VERSION_INFO.getValue(), JcrProps.SLING_FOLDER.getValue());
            infoNode.setProperty(JcrProps.ORIGINAL_PATH.getValue(), dictionaryPath);
            for (NodeIterator iterator = copiedNode.getNodes(); iterator.hasNext(); ) {
                Node lang = iterator.nextNode();
                if (lang.hasProperty(JcrProps.JCR_LANGUAGE.getValue())) {
                    // storing language
                    lang.setProperty(JcrProps.LANGUAGE.getValue(), lang.getProperty(JcrProps.JCR_LANGUAGE.getValue())
                            .getValue().getString());
                    // removing property in order to hide in translator
                    lang.setProperty(JcrProps.JCR_LANGUAGE.getValue(), (Value) null);
                }
            }
            session.save();
            session.logout();
        } catch (RepositoryException e) {
            throw new RepositoryRuntimeException(SESSION_ERROR, e);
        } finally {
            if (session != null) {
                session.logout();
            }
        }
        Map<String, String> response = new LinkedHashMap<>();
        response.put(JcrProps.STATUS.getValue(), JcrProps.OK.getValue());
        return response;
    }

    /**
     * @Inheritdoc
     */
    @Override
    public Set<String> fetchDictionaryVersions(String originalPath) {
        Session session = null;
        Set<String> i18nPaths = new HashSet<>();
        try {
            session = repository.loginAdministrative(null);
            QueryManager qm = session.getWorkspace().getQueryManager();
            QueryResult queryResult = qm.createQuery("/jcr:root" + JcrProps.
                    VERSION_PATH.getValue() + "//element(*, mix:language)", Query.XPATH).execute();
            NodeIterator nodeIterator = queryResult.getNodes();
            while (nodeIterator.hasNext()) {
                Node foundNode = nodeIterator.nextNode();
                Node versionInfo = getVersionInfoNode(foundNode);
                if (StringUtils.equalsIgnoreCase(versionInfo.getProperty(JcrProps.ORIGINAL_PATH.getValue())
                                .getValue().getString(),
                        originalPath)) {
                    i18nPaths.add(foundNode.getPath());
                }
            }

        } catch (RepositoryException e) {
            throw new RepositoryRuntimeException(SESSION_ERROR, e);
        } finally {
            if (session != null) {
                session.logout();
            }
        }
        return i18nPaths;
    }

    private Node getVersionInfoNode(Node foundNode) throws RepositoryException {
        Node versionInfo = null;
        try {
            versionInfo = foundNode.getNode(JcrProps.VERSION_INFO.getValue());
        } catch (PathNotFoundException e) {
            LOGGER.warn("Version information not found for node: " + foundNode.getPath(), e);
        }
        return versionInfo;
    }

    /**
     * @Inheritdoc
     */
    @Override
    public Map<String, String> deleteDictionaryVersion(String dictionaryPath) {
        Map<String, String> resp = new LinkedHashMap<>();
        if (StringUtils.startsWith(dictionaryPath, JcrProps.VERSION_PATH.getValue())) {
            Session session = null;
            try {
                session = repository.loginAdministrative(null);
                Node nodeToDelete = session.getNode(dictionaryPath);
                nodeToDelete.remove();
                session.save();
                session.logout();
                resp.put(JcrProps.STATUS.getValue(), JcrProps.OK.getValue());
            } catch (RepositoryException e) {
                throw new RepositoryRuntimeException(SESSION_ERROR, e);
            } finally {
                if (session != null) {
                    session.logout();
                }
            }
        } else {
            resp.put(JcrProps.STATUS.getValue(), JcrProps.ERROR.getValue());
            resp.put("message", "Cannot delete this path");
        }
        return resp;
    }

    /**
     * @Inheritdoc
     */
    @Override
    public void rollbackToVersion(String versionPath) {
        Session session = null;
        try {
            session = repository.loginAdministrative(null);
            Node versionNode = session.getNode(versionPath);
            Node info = versionNode.getNode(JcrProps.VERSION_INFO.getValue());
            String originalPath = info.getProperty(JcrProps.ORIGINAL_PATH.getValue()).getValue().getString();
            Node nodeToRemove = session.getNode(originalPath);
            info.remove();
            nodeToRemove.remove();
            session.move(versionNode.getPath(), originalPath);
            Node rollBackNode = session.getNode(originalPath);
            for (NodeIterator iterator = rollBackNode.getNodes(); iterator.hasNext(); ) {
                Node lang = iterator.nextNode();
                if (lang.hasProperty(JcrProps.LANGUAGE.getValue())) {
                    lang.setProperty(JcrProps.JCR_LANGUAGE.getValue(),
                            lang.getProperty(JcrProps.LANGUAGE.getValue()).getValue().getString());
                    lang.setProperty(JcrProps.LANGUAGE.getValue(), (Value) null);
                }
            }
            session.save();
            session.logout();
        } catch (RepositoryException e) {
            throw new RepositoryRuntimeException(SESSION_ERROR, e);
        } finally {
            if (session != null) {
                session.logout();
            }
        }
    }
}
