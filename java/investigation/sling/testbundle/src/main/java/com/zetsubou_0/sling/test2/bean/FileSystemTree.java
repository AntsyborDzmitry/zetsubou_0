package com.zetsubou_0.sling.test2.bean;

import org.apache.sling.api.resource.Resource;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 10/9/2015.
 */
public class FileSystemTree {
    private Resource resource;
    private List<FileSystemTree> fileSystemTree = new ArrayList<>();

    public Resource getResource() {
        return resource;
    }

    public void setResource(Resource resource) {
        this.resource = resource;
    }

    public List<FileSystemTree> getFileSystemTree() {
        return fileSystemTree;
    }

    public void setFileSystemTree(List<FileSystemTree> fileSystemTree) {
        this.fileSystemTree = fileSystemTree;
    }
}
