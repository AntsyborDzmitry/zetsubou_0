package com.zetsubou_0.sling.test.monitor;

import com.zetsubou_0.sling.test.FsResourceProvider;
import com.zetsubou_0.sling.test.bean.FileSystemTree;
import com.zetsubou_0.sling.test.helper.FsHelper;
import org.apache.sling.api.SlingConstants;
import org.osgi.service.event.Event;
import org.osgi.service.event.EventAdmin;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.*;

/**
 * Created by Kiryl_Lutsyk on 10/9/2015.
 */
public class FileMonitor extends TimerTask {
    private static final Logger LOG = LoggerFactory.getLogger(FileMonitor.class);
    private static FileSystemTree tree;

    private final FsResourceProvider resourceProvider;
    private final Timer timer;

    public FileMonitor(FsResourceProvider resourceProvider, long interval) {
        this.resourceProvider = resourceProvider;
        this.timer = new Timer();
        timer.schedule(this, 0, interval);
    }

    @Override
    public void run() {
        synchronized(timer) {
            try {
                if(tree == null) {
                    LOG.debug("Scanning ...");
                    String root = resourceProvider.getFsMountPoint();
                    if(root == null) {
                        LOG.debug("Root is empty");
                        stop();
                        return;
                    }
                    tree = getTree(root);
                    LOG.debug("Scanned");
                } else {
                    update(tree);
                }
            } catch (Exception e) {
                LOG.error(e.getMessage(), e);
            }
        }
    }

    public void stop() {
        synchronized(timer) {
            tree = null;
            cancel();
            timer.cancel();
        }
    }

    private FileSystemTree getTree(String root) throws Exception {
        FileSystemTree tree = null;
        File file = new File(root);
        if(file != null) {
            tree = new FileSystemTree();
            tree.setFile(file);
            init(tree);
        }
        return tree;
    }

    private void update(FileSystemTree tree) throws Exception {
        EventAdmin eventAdmin = resourceProvider.getEventAdmin();
        if(eventAdmin == null) {
            throw new Exception("Event admin is null");
        }
        File file = tree.getFile();
        if(!file.exists()) {
            tree.setFile(null);
            tree.setFileSystemTree(null);
            sendEvent(SlingConstants.TOPIC_RESOURCE_REMOVED, file);
        } else {
            if(tree.isModified()) {
                sendEvent(SlingConstants.TOPIC_RESOURCE_CHANGED, file);
            } else {
                File[] files = file.listFiles();
                if(files != null) {
                    List<File> availableFiles = new ArrayList<>(Arrays.asList(files));
                    for(FileSystemTree fsTree : tree.getFileSystemTree()) {
                        update(fsTree);
                        File f = fsTree.getFile();
                        if(f != null) {
                            availableFiles.remove(f);
                        }
                    }
                    for(File newFile : availableFiles) {
                        sendEvent(SlingConstants.TOPIC_RESOURCE_ADDED, newFile);
                    }
                }
            }
        }
    }

    private void init(FileSystemTree tree) throws Exception {
        EventAdmin eventAdmin = resourceProvider.getEventAdmin();
        if(eventAdmin == null) {
            throw new Exception("Event admin is null");
        }
        File parent = tree.getFile();
        sendEvent(SlingConstants.TOPIC_RESOURCE_ADDED, parent);
        if(parent.isDirectory()) {
            for(File f : parent.listFiles()) {
                FileSystemTree fileSystemTree = new FileSystemTree();
                fileSystemTree.setFile(f);
                tree.getFileSystemTree().add(fileSystemTree);
                init(fileSystemTree);
            }
        }
    }

    private void sendEvent(String topic, File file) {
        Map<String, Object> properties = new HashMap<>();
        properties.put(FsHelper.HELPER, FsHelper.HELPER_CLASS);
        properties.put(FsHelper.FILE, file);
        properties.put(FsHelper.RESOURCE, null);
        resourceProvider.getEventAdmin().postEvent(new Event(topic, properties));
    }
}
