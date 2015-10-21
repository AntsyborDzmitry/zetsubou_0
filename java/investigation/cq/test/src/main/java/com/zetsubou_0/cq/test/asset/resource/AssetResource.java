package com.zetsubou_0.cq.test.asset.resource;

import com.day.cq.dam.api.Asset;
import com.zetsubou_0.cq.test.asset.AssetProvider;
import com.zetsubou_0.cq.test.asset.bean.CustomAsset;
import org.apache.sling.adapter.annotations.Adaptable;
import org.apache.sling.adapter.annotations.Adapter;
import org.apache.sling.api.resource.*;
import org.apache.sling.api.wrappers.ValueMapDecorator;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.HashMap;

/**
 * Created by Kiryl_Lutsyk on 10/20/2015.
 */
@Adaptable(adaptableClass = Resource.class, adapters = {
        @Adapter({Asset.class}),
        @Adapter({ValueMap.class})
})
public class AssetResource extends AbstractResource {
    public static final String RESOURCE_TYPE = "test/resource/asset";
    public static final String URL = "url";
    public static final String MIME_TYPE = "mimeType";

    private final AssetProvider provider;
    private final ResourceResolver resourceResolver;
    private final URL url;
    private final ValueMap valueMap;
    private final ResourceMetadata metadata;
    private final Asset asset;

    public AssetResource() {
        this(null, null);
    }

    public AssetResource(AssetProvider provider, URL url) {
        this.provider = provider;
        this.resourceResolver = provider.getResourceResolver();
        this.url = url;
        this.metadata = new ResourceMetadata();
        this.valueMap = new ValueMapDecorator(new HashMap<String, Object>());
        this.asset = new CustomAsset(this);

        try{
            URLConnection connection = url.openConnection();
            connection.connect();
            metadata.put(MIME_TYPE, connection.getContentType());
        } catch (IOException e) {}

        metadata.put(URL, url);
        valueMap.put(URL, metadata.get(URL));
        valueMap.put(MIME_TYPE, metadata.get(MIME_TYPE));
    }

    @Override
    public String getPath() {
        String[] parts = url.getPath().split("/");
        return provider.getSlingMountPoint() + "/" + parts[parts.length - 1].replace(".", "_");
    }

    @Override
    public String getResourceType() {
        return RESOURCE_TYPE;
    }

    @Override
    public String getResourceSuperType() {
        return null;
    }

    @Override
    public ResourceMetadata getResourceMetadata() {
        return metadata;
    }

    @Override
    public ResourceResolver getResourceResolver() {
        return resourceResolver;
    }

    @Override
    public <AdapterType> AdapterType adaptTo(Class<AdapterType> type) {
        if(type == ValueMap.class) {
            return (AdapterType) valueMap;
        } else if(type == Asset.class) {
            return (AdapterType) asset;
        }
        return super.adaptTo(type);
    }

    public String getMimeType() {
        return (String) metadata.get(MIME_TYPE);
    }

    public InputStream getInputStream() throws IOException {
        URLConnection connection = url.openConnection();
        connection.connect();
        return connection.getInputStream();
    }
}
