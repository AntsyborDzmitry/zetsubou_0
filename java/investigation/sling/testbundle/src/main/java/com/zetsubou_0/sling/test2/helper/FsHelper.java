package com.zetsubou_0.sling.test2.helper;

import com.zetsubou_0.sling.test2.FsResourceProvider;
import com.zetsubou_0.sling.test2.bean.FileSystemTree;
import org.apache.sling.api.SlingConstants;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceProvider;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.event.Event;
import org.osgi.service.event.EventAdmin;

import java.io.File;
import java.util.*;

/**
 * Created by Kiryl_Lutsyk on 10/13/2015.
 */
public class FsHelper {
    public static final String HELPER_CLASS = FsHelper.class.getName();
    public static final String HELPER = "helper";
    public static final String EVENT_ADMIN = "eventAdmin";
    public static final String RESOURCE = "resource";
    public static final String FILE = "file";

    public static FileSystemTree getTree(FsResourceProvider resourceProvider, String root, Map<String, Object> properties) throws Exception {
        FileSystemTree tree = null;
        File file = new File(root);
        if(file != null) {
            tree = new FileSystemTree();
            tree.setFile(file);
            init(resourceProvider, tree, properties);
        }
        return tree;
    }

    public static void update(FsResourceProvider resourceProvider, FileSystemTree tree, Map<String, Object> properties) throws Exception {
        EventAdmin eventAdmin = (EventAdmin) properties.get(EVENT_ADMIN);
        if(eventAdmin == null) {
            throw new Exception("Event admin is null");
        }
        File file = tree.getFile();
        if(!file.exists()) {
            tree.setFile(null);
            tree.setFileSystemTree(null);
            sendEvent(resourceProvider, eventAdmin, SlingConstants.TOPIC_RESOURCE_REMOVED, file);
        } else {
            if(tree.isModified()) {
                sendEvent(resourceProvider, eventAdmin, SlingConstants.TOPIC_RESOURCE_CHANGED, file);
            }
            List<File> availableFiles = new ArrayList<>(Arrays.asList(file.listFiles()));
            for(FileSystemTree fsTree : tree.getFileSystemTree()) {
                update(resourceProvider, fsTree, properties);
                File f = fsTree.getFile();
                if(f != null) {
                    availableFiles.remove(f);
                }
            }
            for(File newFile : availableFiles) {
                sendEvent(resourceProvider, eventAdmin, SlingConstants.TOPIC_RESOURCE_ADDED, newFile);
            }
        }
    }

    public static boolean checkEvent(Event event) {
        return FsHelper.HELPER_CLASS.equals(event.getProperty(FsHelper.HELPER));
    }

    public static void createResource(ResourceResolver resourceResolver, ResourceProvider resourceProvider, Resource base, String path, Map<String, Object> properties) {

    }

    private static void init(FsResourceProvider resourceProvider, FileSystemTree tree, Map<String, Object> properties) throws Exception {
        EventAdmin eventAdmin = (EventAdmin) properties.get(EVENT_ADMIN);
        if(eventAdmin == null) {
            throw new Exception("Event admin is null");
        }
        File parent = tree.getFile();
        sendEvent(resourceProvider, eventAdmin, SlingConstants.TOPIC_RESOURCE_ADDED, parent);
        if(parent.isDirectory()) {
            for(File f : parent.listFiles()) {
                FileSystemTree fileSystemTree = new FileSystemTree();
                fileSystemTree.setFile(f);
                tree.getFileSystemTree().add(fileSystemTree);
                init(resourceProvider, fileSystemTree, properties);
            }
        }
    }

    private static void sendEvent(FsResourceProvider resourceProvider, EventAdmin eventAdmin, String topic, File file) {
        Map<String, Object> properties = new HashMap<>();
        properties.put(HELPER, HELPER_CLASS);
        properties.put(FILE, file);
        properties.put(RESOURCE, null);
        eventAdmin.postEvent(new Event(topic, properties));
    }
}
