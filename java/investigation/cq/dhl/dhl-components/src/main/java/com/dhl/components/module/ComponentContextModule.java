package com.dhl.components.module;

import static com.day.cq.wcm.api.components.ComponentContext.CONTEXT_ATTR_NAME;
import static org.apache.commons.lang.StringUtils.substringAfter;
import static org.apache.sling.api.resource.ResourceUtil.getValueMap;

import javax.jcr.RepositoryException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;

import com.cognifide.slice.api.qualifier.CurrentResourcePath;
import com.cognifide.slice.cq.qualifier.CurrentPagePath;
import com.cognifide.slice.cq.qualifier.CurrentTemplatePath;
import com.day.cq.wcm.api.components.ComponentContext;
import com.dhl.components.annotation.ParentComponentAttributes;
import com.dhl.components.annotation.TemplateAttributes;
import com.dhl.services.dao.SlingDao;
import com.google.inject.AbstractModule;
import com.google.inject.Provides;

public class ComponentContextModule extends AbstractModule {

    @Override
    protected void configure() {
        // Nothing to configure
    }

    @Provides
    public ComponentContext getComponentContextModsel(final SlingHttpServletRequest slingServletRequest) {
        return (ComponentContext) slingServletRequest.getAttribute(CONTEXT_ATTR_NAME);
    }

    @Provides
    @ParentComponentAttributes
    public ValueMap getParentLocalResource(final SlingDao slingDao, final ComponentContext ctx)
            throws RepositoryException {
        if (ctx.getParent() == null || ctx.getResource() == null) {
            return ValueMap.EMPTY;
        }
        String localResourceName = ctx.getResource().getName();
        String parrentComponentPath = ctx.getParent().getComponent().getPath();
        Resource parentComponentResource = slingDao.getResource(parrentComponentPath);
        return getValueMap(parentComponentResource.getChild(localResourceName));
    }

    @Provides
    @TemplateAttributes
    public ValueMap getTemplateResource(final SlingDao slingDao, @CurrentTemplatePath final String templatePath,
            @CurrentPagePath final String pagePath, @CurrentResourcePath final String resourcePath)
            throws RepositoryException {
        Resource template = slingDao.getResource(templatePath);
        String relativePath = substringAfter(resourcePath, pagePath + "/");
        return getValueMap(template.getChild(relativePath));
    }
}