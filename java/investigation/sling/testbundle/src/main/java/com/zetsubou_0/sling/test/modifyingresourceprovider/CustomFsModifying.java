package com.zetsubou_0.sling.test.modifyingresourceprovider;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Iterator;
import java.util.Map;

/**
 * Created by Kiryl_Lutsyk on 10/7/2015.
 */
@Component
@Service
@Property(name = CustomSlingConstants.MODIFYING_RESOURCE_PROVIDER_NAME, value = CustomSlingConstants.CUSTOM_MODIFYING_RESOURCE_PROVIDER_NAME)
public class CustomFsModifying implements ModifyingResourceProvider {
    @Override
    public Resource create(ResourceResolver resourceResolver, String s, Map<String, Object> map) throws PersistenceException {
        return null;
    }

    @Override
    public void delete(ResourceResolver resourceResolver, String s) throws PersistenceException {
        CustomFsResource resource = new CustomFsResource(resourceResolver, s);
        resourceResolver.delete(resource);
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

    @Deprecated
    @Override
    public Resource getResource(ResourceResolver resourceResolver, HttpServletRequest httpServletRequest, String s) {
        return getResource(resourceResolver, s);
    }

    @Override
    public Resource getResource(ResourceResolver resourceResolver, String s) {
        return new CustomFsResource(resourceResolver, s);
    }

    @Override
    public Iterator<Resource> listChildren(Resource resource) {
        return resource.listChildren();
    }
}
