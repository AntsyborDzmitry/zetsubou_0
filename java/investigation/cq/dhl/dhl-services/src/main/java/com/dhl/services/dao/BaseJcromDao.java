package com.dhl.services.dao;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.jcrom.Jcrom;
import org.jcrom.callback.JcromCallback;
import org.jcrom.dao.AbstractJcrDAO;
import org.jcrom.util.NodeFilter;
import org.jcrom.util.PathUtils;

import com.dhl.services.exception.JcromSessionCreationException;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.query.qom.Column;
import javax.jcr.query.qom.Constraint;
import javax.jcr.query.qom.Ordering;
import javax.jcr.query.qom.Source;

import java.util.List;

@Component
public abstract class BaseJcromDao<I> extends AbstractJcrDAO<I> {
    private ThreadLocal<Long> methodCounter = new ThreadLocal<Long>() {
        @Override
        protected Long initialValue() {
            return 0L;
        }
    };

    @Reference
    private JcrSessionFactory jcrSessionFactory;

    public BaseJcromDao(Jcrom jcrom) {
        super(jcrom);
    }

    /**
     * Tracks entrance to the method to be able to close the session on the method end.<br/>
     * Call this method on the entry of every method which is somehow related to JCR repository
     * data access, so the session will be closed when method ends.
     */
    protected void enterMethod() {
        methodCounter.set(methodCounter.get() + 1);
    }

    private void leaveMethod() {
        methodCounter.set(methodCounter.get() - 1);
    }

    /**
     * Closes the session when tracked method ends execution.</br>
     * Call this method in finally block of every method you called the enterMethod() in.
     */
    protected void closeSessionOnMethodEnd() {
        leaveMethod();
        if (methodCounter.get() == 0) {
            methodCounter.remove();
            jcrSessionFactory.closeCurrentSession();
        }
    }

    @Override
    protected Session getSession() {
        try {
            return jcrSessionFactory.getCurrentSession();
        } catch (RepositoryException e) {
            throw new JcromSessionCreationException("Fail during creating session", e);
        }
    }

    @Override
    public I create(I entity) {
        try {
            enterMethod();
            return super.create(entity);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public I create(I entity, JcromCallback action) {
        try {
            enterMethod();
            return super.create(entity, action);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public I create(String parentNodePath, I entity) {
        try {
            enterMethod();
            return super.create(parentNodePath, entity);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public I create(String parentNodePath, I entity, JcromCallback action) {
        try {
            enterMethod();
            return super.create(parentNodePath, entity, action);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public I update(I entity) {
        try {
            enterMethod();
            return super.update(entity);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public I update(I entity, JcromCallback action) {
        try {
            enterMethod();
            return super.update(entity, action);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public I update(I entity, String childNameFilter, int maxDepth) {
        try {
            enterMethod();
            return super.update(entity, new NodeFilter(childNameFilter, maxDepth), null);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public I update(I entity, NodeFilter nodeFilter) {
        try {
            enterMethod();
            return super.update(entity, nodeFilter);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public I update(I entity, NodeFilter nodeFilter, JcromCallback action) {
        try {
            enterMethod();
            return super.update(entity, nodeFilter, action);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public I updateByUUID(I entity, String uuid) {
        try {
            enterMethod();
            return super.updateById(entity, uuid, new NodeFilter(NodeFilter.INCLUDE_ALL, NodeFilter.DEPTH_INFINITE),
                    null);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public I updateById(I entity, String id) {
        try {
            enterMethod();
            return super.updateById(entity, id);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public I updateById(I entity, String id, JcromCallback action) {
        try {
            enterMethod();
            return super.updateById(entity, id, action);
        } finally {
            closeSessionOnMethodEnd();
        }
    }


    @Override
    public I updateById(I entity, String id, String childNameFilter, int maxDepth) {
        try {
            enterMethod();
            return super.updateById(entity, id, new NodeFilter(childNameFilter, maxDepth), null);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public I updateById(I entity, String id, NodeFilter nodeFilter) {
        try {
            enterMethod();
            return super.updateById(entity, id, nodeFilter);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public I updateById(I entity, String id, NodeFilter nodeFilter, JcromCallback action) {
        try {
            enterMethod();
            return super.updateById(entity, id, nodeFilter, action);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public void move(I entity, String newParentPath) {
        try {
            enterMethod();
            super.move(entity, newParentPath);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public void remove(String path) {
        try {
            enterMethod();
            super.remove(path);
        } finally {
            closeSessionOnMethodEnd();
        }
    }


    @Override
    public void removeById(String id) {
        try {
            enterMethod();
            super.removeById(id);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public boolean exists(String path) {
        try {
            enterMethod();
            return super.exists(path);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public I get(String path) {
        try {
            enterMethod();
            return super.get(path);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public I get(String path, String childNameFilter, int maxDepth) {
        try {
            enterMethod();
            return super.get(path, new NodeFilter(childNameFilter, maxDepth));
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public I get(String path, NodeFilter nodeFilter) {
        try {
            enterMethod();
            return super.get(path, nodeFilter);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public List<I> getAll(String path) {
        try {
            enterMethod();
            return super.getAll(path);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public List<I> getAll(String path, long startIndex, long resultSize) {
        try {
            enterMethod();
            return super.getAll(path, startIndex, resultSize);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public List<I> getAll(String path, String childNameFilter, int maxDepth) {
        try {
            enterMethod();
            return super.getAll(path, new NodeFilter(childNameFilter, maxDepth));
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public List<I> getAll(String path, NodeFilter nodeFilter) {
        try {
            enterMethod();
            return super.getAll(path, nodeFilter);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public List<I> getAll(String path, String childNameFilter, int maxDepth, long startIndex, long resultSize) {
        try {
            enterMethod();
            return super.getAll(path, new NodeFilter(childNameFilter, maxDepth), startIndex, resultSize);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public List<I> getAll(String path, NodeFilter nodeFilter, long startIndex, long resultSize) {
        try {
            enterMethod();
            return super.getAll(path, nodeFilter, startIndex, resultSize);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public I loadById(String id) {
        try {
            enterMethod();
            return super.loadById(id);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public I loadById(String id, String childNameFilter, int maxDepth) {
        try {
            enterMethod();
            return super.loadById(id, new NodeFilter(childNameFilter, maxDepth));
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public I loadById(String id, NodeFilter nodeFilter) {
        try {
            enterMethod();
            return super.loadById(id, nodeFilter);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public List<I> getVersionList(String path) {
        try {
            enterMethod();
            return super.getVersionList(path);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public List<I> getVersionList(String path, String childNameFilter, int maxDepth) {
        try {
            enterMethod();
            return super.getVersionList(path, new NodeFilter(childNameFilter, maxDepth));
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public List<I> getVersionList(String path, NodeFilter nodeFilter) {
        try {
            enterMethod();
            return super.getVersionList(path, nodeFilter);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public List<I> getVersionList(String path, String childNameFilter, int maxDepth, long startIndex, long resultSize) {
        try {
            enterMethod();
            return super.getVersionList(path, new NodeFilter(childNameFilter, maxDepth), startIndex, resultSize);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public List<I> getVersionList(String path, NodeFilter nodeFilter, long startIndex, long resultSize) {
        try {
            enterMethod();
            return super.getVersionList(path, nodeFilter, startIndex, resultSize);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public List<I> getVersionListById(String id) {
        try {
            enterMethod();
            return super.getVersionListById(id);
        } finally {
            closeSessionOnMethodEnd();
        }
    }


    @Override
    public List<I> getVersionListById(String id, String childNameFilter, int maxDepth) {
        try {
            enterMethod();
            return super.getVersionListById(id, new NodeFilter(childNameFilter, maxDepth));
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public List<I> getVersionListById(String id, NodeFilter nodeFilter) {
        try {
            enterMethod();
            return super.getVersionListById(id, nodeFilter);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public List<I> getVersionListById(String id, String childNameFilter,
                                      int maxDepth, long startIndex, long resultSize) {
        try {
            enterMethod();
            return super.getVersionListById(id, new NodeFilter(childNameFilter, maxDepth), startIndex, resultSize);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public List<I> getVersionListById(String id, NodeFilter nodeFilter, long startIndex, long resultSize) {
        try {
            enterMethod();
            return super.getVersionListById(id, nodeFilter, startIndex, resultSize);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public long getVersionSize(String path) {
        try {
            enterMethod();
            return super.getVersionSize(path);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public long getVersionSizeById(String id) {
        try {
            enterMethod();
            return super.getVersionSizeById(id);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public I getVersion(String path, String versionName) {
        try {
            enterMethod();
            return super.getVersion(path, versionName);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public I getVersion(String path, String versionName, String childNameFilter, int maxDepth) {
        try {
            enterMethod();
            return super.getVersion(path, versionName, new NodeFilter(childNameFilter, maxDepth));
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public I getVersion(String path, String versionName, NodeFilter nodeFilter) {
        try {
            enterMethod();
            return super.getVersion(path, versionName, nodeFilter);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public I getVersionById(String id, String versionName) {
        try {
            enterMethod();
            return super.getVersionById(id, versionName);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public I getVersionById(String id, String versionName, String childNameFilter, int maxDepth) {
        try {
            enterMethod();
            return super.getVersionById(id, versionName, new NodeFilter(childNameFilter, maxDepth));
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public I getVersionById(String id, String versionName, NodeFilter nodeFilter) {
        try {
            enterMethod();
            return super.getVersionById(id, versionName, nodeFilter);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public void restoreVersion(String path, String versionName) {
        try {
            enterMethod();
            super.restoreVersion(path, versionName);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public void restoreVersionById(String id, String versionName) {
        try {
            enterMethod();
            super.restoreVersionById(id, versionName);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public void restoreVersion(String path, String versionName, boolean removeExisting) {
        try {
            enterMethod();
            super.restoreVersion(path, versionName, removeExisting);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public void restoreVersionById(String id, String versionName, boolean removeExisting) {
        try {
            enterMethod();
            super.restoreVersionById(id, versionName, removeExisting);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public void removeVersion(String path, String versionName) {
        try {
            enterMethod();
            super.removeVersion(path, versionName);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public void removeVersionById(String id, String versionName) {
        try {
            enterMethod();
            super.removeVersionById(id, versionName);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public long getSize(String rootPath) {
        try {
            enterMethod();
            return super.getSize(rootPath);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public List<I> findAll(String rootPath) {
        try {
            enterMethod();
            return super.findAll(rootPath);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public List<I> findAll(String rootPath, long startIndex, long resultSize) {
        try {
            enterMethod();
            return super.findAll(rootPath, startIndex, resultSize);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public List<I> findAll(String rootPath, String childNameFilter, int maxDepth) {
        try {
            enterMethod();
            return super.findAll(rootPath, new NodeFilter(childNameFilter, maxDepth));
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public List<I> findAll(String rootPath, NodeFilter nodeFilter) {
        try {
            enterMethod();
            return super.findAll(rootPath, nodeFilter);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public List<I> findAll(String rootPath, String childNameFilter, int maxDepth, long startIndex, long resultSize) {
        try {
            enterMethod();
            return super.findAll(rootPath, new NodeFilter(childNameFilter, maxDepth), startIndex, resultSize);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    public List<I> findAll(String rootPath, NodeFilter nodeFilter, long startIndex, long resultSize) {
        try {
            enterMethod();
            return super.findAll(rootPath, nodeFilter, startIndex, resultSize);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    @Override
    protected Node getNodeById(String id) throws RepositoryException {
        try {
            enterMethod();
            return super.getNodeById(id);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    protected Node getNode(String absolutePath) throws RepositoryException {
        try {
            enterMethod();
            return super.getNode(absolutePath);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    protected NodeIterator getNodes(String absolutePath) throws RepositoryException {
        try {
            enterMethod();
            return "/".equals(absolutePath) ? getSession().getRootNode().getNodes() :
                getSession().getRootNode().getNode(PathUtils.relativePath(absolutePath)).getNodes();
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    protected I update(Node node, I entity, NodeFilter nodeFilter, JcromCallback action) {
        try {
            enterMethod();
            return super.update(node, entity, nodeFilter, action);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    protected I getVersion(Node node, String versionName, NodeFilter nodeFilter) {
        try {
            enterMethod();
            return super.getVersion(node, versionName, nodeFilter);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    protected void restoreVersion(Node node, String versionName, boolean removeExisting) {
        try {
            enterMethod();
            super.restoreVersion(node, versionName, removeExisting);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    protected void removeVersion(Node node, String versionName) {
        try {
            enterMethod();
            super.removeVersion(node, versionName);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    protected long getVersionSize(Node node) {
        try {
            enterMethod();
            return super.getVersionSize(node);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    protected List<I> getVersionList(Node node, NodeFilter nodeFilter) {
        try {
            enterMethod();
            return super.getVersionList(node, nodeFilter);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    protected List<I> getVersionList(Node node, NodeFilter nodeFilter, long startIndex, long resultSize) {
        try {
            enterMethod();
            return super.getVersionList(node, nodeFilter, startIndex, resultSize);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    protected List<I> findByXPath(String xpath, NodeFilter nodeFilter, long startIndex, long resultSize) {
        try {
            enterMethod();
            return super.findByXPath(xpath, nodeFilter, startIndex, resultSize);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    protected List<I> findByXPath(String xpath, NodeFilter nodeFilter) {
        try {
            enterMethod();
            return super.findByXPath(xpath, nodeFilter);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    protected List<I> findBySql(String sql, NodeFilter nodeFilter, long startIndex, long resultSize) {
        try {
            enterMethod();
            return super.findBySql(sql, nodeFilter, startIndex, resultSize);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    protected List<I> findBySql(String sql, NodeFilter nodeFilter) {
        try {
            enterMethod();
            return super.findBySql(sql, nodeFilter);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    protected List<I> findByQOM(Source source, Constraint constraint,
                                Ordering[] orderings, Column[] columns, NodeFilter nodeFilter) {
        try {
            enterMethod();
            return super.findByQOM(source, constraint, orderings, columns, nodeFilter);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    protected List<I> toList(NodeIterator nodeIterator, NodeFilter nodeFilter) {
        try {
            enterMethod();
            return super.toList(nodeIterator, nodeFilter);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    protected List<I> toList(NodeIterator nodeIterator, NodeFilter nodeFilter, long resultSize) {
        try {
            enterMethod();
            return super.toList(nodeIterator, nodeFilter, resultSize);
        } finally {
            closeSessionOnMethodEnd();
        }
    }

    protected Class<I> getEntityClass() {
        return super.getEntityClass();
    }

    protected Jcrom getJcrom() {
        return super.getJcrom();
    }

    protected String[] getMixinTypes() {
        return super.getMixinTypes();
    }

    public JcrSessionFactory getJcrSessionFactory() {
        return jcrSessionFactory;
    }

    public void setJcrSessionFactory(JcrSessionFactory jcrSessionFactory) {
        this.jcrSessionFactory = jcrSessionFactory;
    }

}
