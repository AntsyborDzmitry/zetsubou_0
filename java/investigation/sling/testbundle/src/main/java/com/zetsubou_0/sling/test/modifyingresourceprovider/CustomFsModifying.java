package com.zetsubou_0.sling.test.modifyingresourceprovider;

import com.zetsubou_0.sling.test.modifyingresourceprovider.monitor.CustomFsMonitor;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.resource.*;
import org.osgi.service.event.EventAdmin;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * Created by Kiryl_Lutsyk on 10/7/2015.
 */
@Component
@Service
@Property(name = CustomSlingConstants.MODIFYING_RESOURCE_PROVIDER_NAME, value = CustomSlingConstants.CUSTOM_MODIFYING_RESOURCE_PROVIDER_NAME)
public class CustomFsModifying implements ModifyingResourceProvider {
    private static final Logger LOG = LoggerFactory.getLogger(CustomFsModifying.class);

    @Reference(cardinality= ReferenceCardinality.OPTIONAL_UNARY, policy=ReferencePolicy.DYNAMIC)
    private EventAdmin eventAdmin;
    @Reference(cardinality= ReferenceCardinality.OPTIONAL_UNARY, policy=ReferencePolicy.DYNAMIC)
    private ResourceResolverFactory resourceResolverFactory;

    private CustomFsMonitor customFsMonitor;

    @Override
    public Resource create(ResourceResolver resourceResolver, String s, Map<String, Object> map) throws PersistenceException {
        return null;
    }

    @Override
    public void delete(ResourceResolver resourceResolver, String s) {
        if(s.startsWith(CustomSlingConstants.DEFAULT_SLING_ROOT_PREFIX)) {
            s = s.replace(CustomSlingConstants.DEFAULT_SLING_ROOT_PREFIX, "");
        }
        CustomFsResource resource = (CustomFsResource) getResource(resourceResolver, s);
        try {
            resource.fullRemove();
        } catch (PersistenceException e) {
            LOG.error(e.getMessage(), e);
        }
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

    @Activate
    protected void activate() {
        try {
            ResourceResolver resourceResolver = resourceResolverFactory.getAdministrativeResourceResolver(null);
            if(resourceResolver != null) {
                customFsMonitor = new CustomFsMonitor(eventAdmin, resourceResolver, this);
                new Thread(customFsMonitor).start();
            }
        } catch (LoginException e) {
            LOG.error(e.getMessage(), e);
        }
    }

    @Deactivate
    protected void deactivate() {
        customFsMonitor.stop();
    }
}
