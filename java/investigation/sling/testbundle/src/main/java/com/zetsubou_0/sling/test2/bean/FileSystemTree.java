package com.zetsubou_0.sling.test2.bean;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 10/9/2015.
 */
public class FileSystemTree {
    private List<FileSystemTree> fileSystemTree = new ArrayList<>();
    private FileInfo fileInfo = new FileInfo();

    public File getFile() {
        return fileInfo.getFile();
    }

    public void setFile(File file) {
        fileInfo.setFile(file);
        fileInfo.setLastModified(file.lastModified());
    }

    public List<FileSystemTree> getFileSystemTree() {
        return fileSystemTree;
    }

    public void setFileSystemTree(List<FileSystemTree> fileSystemTree) {
        this.fileSystemTree = fileSystemTree;
    }

    public boolean isModified() {
        return fileInfo.isModified();
    }
}
