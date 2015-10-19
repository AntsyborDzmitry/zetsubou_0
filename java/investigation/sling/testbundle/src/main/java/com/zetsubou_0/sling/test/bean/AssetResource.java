package com.zetsubou_0.sling.test.bean;

import com.day.cq.dam.api.Asset;
import org.apache.sling.api.resource.AbstractResource;
import org.apache.sling.api.resource.ResourceMetadata;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.ValueMapDecorator;

import java.util.HashMap;

/**
 * Created by Kiryl_Lutsyk on 10/19/2015.
 */
public class AssetResource extends AbstractResource {
    private final ResourceResolver resourceResolver;
    private final Asset asset;
    private final ValueMap valueMap;

    private ResourceMetadata resourceMetadata = new ResourceMetadata();

    public AssetResource(ResourceResolver resourceResolver, Asset asset) {
        this.resourceResolver = resourceResolver;
        this.asset = asset;
        valueMap = new ValueMapDecorator(new HashMap<String, Object>());
    }

    @Override
    public String getPath() {
        return null;
    }

    @Override
    public String getResourceType() {
        return null;
    }

    @Override
    public String getResourceSuperType() {
        return null;
    }

    @Override
    public ResourceMetadata getResourceMetadata() {
        return null;
    }

    @Override
    public ResourceResolver getResourceResolver() {
        return null;
    }

    private void fill() {

    }
}
