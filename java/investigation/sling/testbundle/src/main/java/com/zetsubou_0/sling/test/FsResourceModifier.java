package com.zetsubou_0.sling.test;

import com.zetsubou_0.sling.test.api.FsPropertyProvider;
import com.zetsubou_0.sling.test.bean.FsResource;
import com.zetsubou_0.sling.test.helper.FsHelper;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.*;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.resource.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.*;

/**
 * Created by Kiryl_Lutsyk on 10/15/2015.
 */
@Component
@Service
@Property(name = "custom.modifier", value = "FsResourceModifier")
public class FsResourceModifier implements ModifyingResourceProvider {
    private static final Logger LOG = LoggerFactory.getLogger(FsResourceModifier.class);
    private static final String FILE_WITH_EXTENSION = "^.*[.].+$";

    private Set<String> cache = new HashSet<>();

    @Reference(target = "(" + FsResourceProvider.COMPONENT_PROPERTY + "=" + FsResourceProvider.COMPONENT_NAME + ")")
    private ResourceProvider resourceProvider;

    @Reference
    private FsPropertyProvider fsPropertyProvider;

    @Override
    public Resource create(ResourceResolver resourceResolver, String path, Map<String, Object> properties) throws PersistenceException {
        path = path.replace(FsHelper.BACK_SLASH, FsHelper.SLASH);
        Source source = getSource(path);

        try {
            if(source == Source.FILE_SYSTEM) {
                createFile(path, null);
                return resourceProvider.getResource(resourceResolver, path.replace(fsPropertyProvider.getFsMountPoint(), fsPropertyProvider.getSlingMountPoint()));
            } else if(source == Source.SLING_TREE) {
                createFile(path.replace(fsPropertyProvider.getSlingMountPoint(), fsPropertyProvider.getFsMountPoint()), null);
                return resourceProvider.getResource(resourceResolver, path);
            } else if(source == Source.OTHER) {
                throw new PersistenceException("Resource wasn't created [path=" + path + "]");
            }
        } catch(IOException e) {
            throw new PersistenceException(e.getMessage());
        }

        return null;
    }

    @Override
    public void delete(ResourceResolver resourceResolver, String path) throws PersistenceException {
        final boolean cleanCache = true;
        path = path.replace(FsHelper.BACK_SLASH, FsHelper.SLASH);
        Source source = getSource(path);

        try {
            if(source == Source.FILE_SYSTEM) {
                deleteFile(path, cleanCache);
            } else if(source == Source.SLING_TREE) {
                deleteFile(path.replace(fsPropertyProvider.getSlingMountPoint(), fsPropertyProvider.getFsMountPoint()), cleanCache);
            } else if(source == Source.OTHER) {
                throw new PersistenceException("Resource wasn't deleted [path=" + path + "]");
            }
        } catch(IOException e) {
            throw new PersistenceException(e.getMessage());
        }
    }

    @Override
    public void revert(ResourceResolver resourceResolver) {
        synchronized(cache) {
            for(String path : cache) {
                File file = new File(path);
                if(file.exists()) {
                    deleteFile(file.getPath(), false);
                }
            }
            cache = new HashSet<>();
        }
    }

    @Override
    public void commit(ResourceResolver resourceResolver) throws PersistenceException {
        synchronized(cache) {
            cache = new HashSet<>();
        }
    }

    @Override
    public boolean hasChanges(ResourceResolver resourceResolver) {
        return cache.size() > 0;
    }

    @Override
    public Resource getResource(ResourceResolver resourceResolver, HttpServletRequest httpServletRequest, String s) {
        return resourceProvider.getResource(resourceResolver, httpServletRequest, s);
    }

    @Override
    public Resource getResource(ResourceResolver resourceResolver, String s) {
        return resourceProvider.getResource(resourceResolver, s);
    }

    @Override
    public Iterator<Resource> listChildren(Resource resource) {
        return resourceProvider.listChildren(resource);
    }

    private enum Source {
        FILE_SYSTEM, SLING_TREE, OTHER;
    }

    private Source getSource(String path) {
        path = path.replace(FsHelper.BACK_SLASH, FsHelper.SLASH);
        Source source = Source.OTHER;

        if(StringUtils.isNotBlank(fsPropertyProvider.getFsMountPoint()) && StringUtils.isNotBlank(fsPropertyProvider.getSlingMountPoint()) && StringUtils.isNotBlank(path)) {
            if(path.startsWith(fsPropertyProvider.getFsMountPoint())) {
                source = Source.FILE_SYSTEM;
            } else if(path.startsWith(fsPropertyProvider.getSlingMountPoint())) {
                source = Source.SLING_TREE;
            }
        }

        return source;
    }

    private void createFile(String path, Map<String, Object> properties) throws IOException {
        path = path.replace(FsHelper.BACK_SLASH, FsHelper.SLASH);
        File file = null;
        if(isFile(path, properties)) {
            file = new File(path);
            createFolders(file);
            try(FileOutputStream out = new FileOutputStream(file)) {
                out.write(new byte[0]);
            }
        } else {
            file = new File(path);
            file.mkdirs();
        }

        if(file != null && file.exists()) {
            synchronized(cache) {
                cache.add(file.getPath());
            }
        }
    }

    private boolean isFile(String path, Map<String, Object> properties) {
        return (properties != null && JcrConstants.NT_FILE.equals(properties.get(FsResource.FILE_TYPE))) ||
                path.matches(FILE_WITH_EXTENSION);
    }

    private void createFolders(File file) throws PersistenceException {
        File parentDir = file.getParentFile();
        if(!parentDir.exists()) {
            createFolders(parentDir);
        }
        if(!isFile(file.getPath(), null)) {
            create(fsPropertyProvider.getResourceResolver(), file.getPath(), null);
        }
    }

    private void deleteFile(String path, boolean cleanCache) {
        path = path.replace(FsHelper.BACK_SLASH, FsHelper.SLASH);
        if(StringUtils.isNotBlank(path) && path.startsWith(fsPropertyProvider.getFsMountPoint())) {
            File file = new File(path);
            if(file.exists()) {
                if(file.isDirectory()) {
                    for(File f : file.listFiles()) {
                        deleteFile(f.getPath(), cleanCache);
                    }
                }
                String filePath = file.getPath();
                file.delete();
                if(cleanCache) {
                    synchronized(cache) {
                        if(cache.contains(filePath)) {
                            cache.remove(filePath);
                        }
                    }
                }
            }
        }
    }
}
