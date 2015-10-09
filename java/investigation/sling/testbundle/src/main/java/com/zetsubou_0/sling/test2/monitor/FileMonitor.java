package com.zetsubou_0.sling.test2.monitor;

import com.zetsubou_0.sling.test2.FsResourceProvider;

/**
 * Created by Kiryl_Lutsyk on 10/9/2015.
 */
public class FileMonitor implements Runnable {
    private final FsResourceProvider resourceProvider;
    private final long interval;

    public FileMonitor(FsResourceProvider resourceProvider, long interval) {
        this.resourceProvider = resourceProvider;
        this.interval = interval;
    }

    @Override
    public void run() {

    }
}
