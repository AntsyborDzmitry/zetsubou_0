package com.zetsubou_0.sling.test;

import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.*;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.SlingConstants;
import org.apache.sling.api.resource.*;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Iterator;
import java.util.Map;

/**
 * Created by Kiryl_Lutsyk on 10/15/2015.
 */
@Component
@Service
public class FsResourceModifier implements ModifyingResourceProvider {
    @Reference(target = "(serviceName=" + FsResourceProvider.COMPONENT_NAME + ")")
    private ResourceProvider resourceProvider;

    @Override
    public Resource create(ResourceResolver resourceResolver, String path, Map<String, Object> properties) throws PersistenceException {
        Resource resource = null;
        String fsBase = ((String) ((FsResourceProvider) resourceProvider).getProperties().get(FsResourceProvider.FS_MOUNT_POINT)).replace("\\", "/");
        String slingBase = (String) ((FsResourceProvider) resourceProvider).getProperties().get(FsResourceProvider.SLING_MOUNT_POINT);
        String resourceType = (String) properties.get(SlingConstants.PROPERTY_RESOURCE_TYPE);
        path = path.replace("\\", "/");

        // find resource
        File file = new File(path);
        // from file
        if(file.exists()) {
            if(!path.startsWith(fsBase)) {
                return null;
            }
            // in repository
            String resourcePath = slingBase + path.replace(fsBase, StringUtils.EMPTY);
            resource = ResourceUtil.getOrCreateResource(resourceResolver, resourcePath, properties, JcrConstants.NT_UNSTRUCTURED, true);
        } else {
            // in repository
            StringBuilder filePath = new StringBuilder();
            String relPath = null;
            if(path.startsWith(slingBase)) {
                resource = ResourceUtil.getOrCreateResource(resourceResolver, path, properties, JcrConstants.NT_UNSTRUCTURED, true);
                relPath = path.replace(slingBase, StringUtils.EMPTY);
                // wrong absolute path
            } else if(path.startsWith("/")) {
                throw new PersistenceException("Validation exception. invalid path: " + path);
                // relative path in repository
            } else {
                resource = ResourceUtil.getOrCreateResource(resourceResolver, slingBase + path, properties, JcrConstants.NT_UNSTRUCTURED, true);
                relPath = path;
            }

            // create file path
            if(fsBase.endsWith("/")) {
                if(relPath.startsWith("/")) {
                    filePath.append(fsBase.substring(1));
                } else {
                    filePath.append(fsBase);
                }
                filePath.append(relPath);
            } else if(relPath.startsWith("/")) {
                filePath.append(fsBase);
                filePath.append(relPath);
            } else {
                filePath.append(fsBase);
                filePath.append("/");
                filePath.append(relPath);
            }

            resourceType = (StringUtils.isNotBlank(resourceType)) ? resourceType : resource.getResourceType();

            File f = new File(filePath.toString());
            // create new file/folder
            if(!f.exists()) {
                if(JcrConstants.NT_FILE.equals(resourceType)) {
                    try(FileOutputStream out = new FileOutputStream(f)) {
                        out.close();
                    } catch (IOException e) {
                        throw new PersistenceException(e.getMessage(), e);
                    }
                } else {
                    f.mkdirs();
                }
            }
        }

        return resource;
    }

    @Override
    public void delete(ResourceResolver resourceResolver, String s) throws PersistenceException {

    }

    @Override
    public void revert(ResourceResolver resourceResolver) {

    }

    @Override
    public void commit(ResourceResolver resourceResolver) throws PersistenceException {

    }

    @Override
    public boolean hasChanges(ResourceResolver resourceResolver) {
        return false;
    }

    @Override
    public Resource getResource(ResourceResolver resourceResolver, HttpServletRequest httpServletRequest, String s) {
        return null;
    }

    @Override
    public Resource getResource(ResourceResolver resourceResolver, String s) {
        return null;
    }

    @Override
    public Iterator<Resource> listChildren(Resource resource) {
        return null;
    }
}
