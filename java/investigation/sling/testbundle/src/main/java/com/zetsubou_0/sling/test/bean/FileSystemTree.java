package com.zetsubou_0.sling.test.bean;

import com.zetsubou_0.sling.test.modifyingresourceprovider.CustomFsResource;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 10/9/2015.
 */
public class FileSystemTree {
    private CustomFsResource resource;
    private List<FileSystemTree> fileSystemTree = new ArrayList<>();

    public CustomFsResource getResource() {
        return resource;
    }

    public void setResource(CustomFsResource resource) {
        this.resource = resource;
    }

    public List<FileSystemTree> getFileSystemTree() {
        return fileSystemTree;
    }

    public void setFileSystemTree(List<FileSystemTree> fileSystemTree) {
        this.fileSystemTree = fileSystemTree;
    }
}
