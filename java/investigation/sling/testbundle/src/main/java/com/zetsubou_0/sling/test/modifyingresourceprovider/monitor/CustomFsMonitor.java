package com.zetsubou_0.sling.test.modifyingresourceprovider.monitor;

import com.zetsubou_0.sling.test.bean.FileSystemTree;
import com.zetsubou_0.sling.test.modifyingresourceprovider.CustomFsResource;
import com.zetsubou_0.sling.test.modifyingresourceprovider.CustomSlingConstants;
import org.apache.sling.api.SlingConstants;
import org.apache.sling.api.resource.*;
import org.osgi.service.event.Event;
import org.osgi.service.event.EventAdmin;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.*;

/**
 * Created by Kiryl_Lutsyk on 10/7/2015.
 */
public class CustomFsMonitor implements Runnable {
    private static final Logger LOG = LoggerFactory.getLogger(CustomFsMonitor.class);

    private ModifyingResourceProvider modifyingResourceProvider;
    private EventAdmin eventAdmin;
    private ResourceResolver resourceResolver;
    private final CustomFsMonitor lock;
    private FileSystemTree fileSystemTree = new FileSystemTree();
    private CustomFsResource rootResource;

    public CustomFsMonitor(EventAdmin eventAdmin, ResourceResolver resourceResolver, ModifyingResourceProvider modifyingResourceProvider) {
        this.eventAdmin = eventAdmin;
        this.resourceResolver = resourceResolver;
        this.modifyingResourceProvider = modifyingResourceProvider;
        this.lock = this;
    }

    @Override
    public void run() {
        try {
            initTree();
            synchronized(lock) {
                lock.wait();
                destroy(fileSystemTree);
            }
        } catch (Exception e) {
            LOG.error(e.getMessage(), e);
        }
    }

    public void stop() {
        synchronized(lock) {
            lock.notifyAll();
        }
    }

    private void resourceManipulate(Resource resource, String topic) throws Exception {
        final Map<String, Object> properties = new HashMap<>();
        if(resource != null) {
            properties.put(SlingConstants.PROPERTY_RESOURCE_TYPE, resource.getResourceType());
            properties.put(SlingConstants.PROPERTY_PATH, resource.getPath());
            properties.put(CustomSlingConstants.FS_PATH, ((CustomFsResource) resource).getFsPath());
            properties.put(CustomSlingConstants.NAME, resource.getPath().replace(CustomSlingConstants.DEFAULT_SLING_ROOT_PREFIX, ""));
            properties.put(CustomSlingConstants.PARENT_RESOURCE_PATH, rootResource.getPath());
            if(CustomSlingConstants.TOPIC_RESOURCE_ADD.equals(topic)) {
                if(resourceResolver.getResource(resource.getPath()) != null) {
                    return;
                }
            } else if(CustomSlingConstants.TOPIC_RESOURCE_REMOVE.equals(topic)) {
                if(resourceResolver.getResource(resource.getPath()) == null) {
                    return;
                }
            }
            eventAdmin.postEvent(new Event(topic, properties));
        }
    }

    private void initTree() throws Exception {
        final String ROOT_PATH = "/";
        rootResource = (CustomFsResource) modifyingResourceProvider.getResource(resourceResolver, ROOT_PATH);
        fileSystemTree.setResource(rootResource);
        init(fileSystemTree);
    }

    private void init(FileSystemTree tree) throws Exception {
        CustomFsResource resource = tree.getResource();
        resourceManipulate(resource, CustomSlingConstants.TOPIC_RESOURCE_ADD);
        File file = resource.getFile();
        if(file.isDirectory()) {
            for(File f : file.listFiles()) {
                CustomFsResource res = (CustomFsResource) modifyingResourceProvider.getResource(resourceResolver, getRelativePath(f.getPath()));
                FileSystemTree fileSystemTree = new FileSystemTree();
                fileSystemTree.setResource(res);
                tree.getFileSystemTree().add(fileSystemTree);
                init(fileSystemTree);
            }
        }
    }

    private String getRelativePath(String absPath) {
        return absPath.replace("\\", "/").replace(CustomSlingConstants.DEFAULT_FS_ROOT_PREFIX, "");
    }

    private void destroy(FileSystemTree tree) throws Exception {
        List<FileSystemTree> treeList = tree.getFileSystemTree();
        if(treeList.size() == 0) {
            resourceManipulate(tree.getResource(), CustomSlingConstants.TOPIC_RESOURCE_REMOVE);
        } else {
            for(FileSystemTree fsTree : treeList) {
                destroy(fsTree);
            }
        }
    }
}
