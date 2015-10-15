package com.zetsubou_0.sling.test.bean;

import java.io.File;

/**
 * Created by Kiryl_Lutsyk on 10/13/2015.
 */
public class FileInfo {
    private long lastModified;
    private File file;

    public long getLastModified() {
        return lastModified;
    }

    public void setLastModified(long lastModified) {
        this.lastModified = lastModified;
    }

    public File getFile() {
        return file;
    }

    public void setFile(File file) {
        this.file = file;
    }

    public boolean isModified() {
        long lastModified = file.lastModified();
        boolean isModified = this.lastModified != lastModified;
        if(isModified) {
            this.lastModified = lastModified;
        }
        return isModified;
    }
}
