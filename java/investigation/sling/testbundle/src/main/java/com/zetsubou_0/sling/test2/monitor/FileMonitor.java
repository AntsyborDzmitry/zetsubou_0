package com.zetsubou_0.sling.test2.monitor;

import com.zetsubou_0.sling.test2.FsResourceProvider;
import com.zetsubou_0.sling.test2.bean.FileSystemTree;
import com.zetsubou_0.sling.test2.helper.FsHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

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
            Map<String, Object> properties = new HashMap<>();
            properties.put(FsHelper.EVENT_ADMIN, resourceProvider.getEventAdmin());
            try {
                if(tree == null) {
                    LOG.debug("Scanning ...");
                    String root = resourceProvider.getFsMountPoint();
                    if(root == null) {
                        LOG.debug("Root is empty");
                        stop();
                        return;
                    }
                    tree = FsHelper.getTree(resourceProvider, root, properties);
                    LOG.debug("Scanned");
                } else {
                    FsHelper.update(resourceProvider, tree, properties);
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
}
