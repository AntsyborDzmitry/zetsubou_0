package com.zetsubou_0.sling.test.asset;

import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.Rendition;
import com.day.cq.dam.api.RenditionPicker;
import com.day.cq.dam.api.Revision;
import com.zetsubou_0.sling.test.bean.FsResource;
import org.apache.sling.adapter.annotations.Adaptable;
import org.apache.sling.adapter.annotations.Adapter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;

import java.io.InputStream;
import java.util.*;

/**
 * Created by Kiryl_Lutsyk on 10/19/2015.
 */
@Adaptable(adaptableClass=Resource.class, adapters={
        @Adapter({Resource.class})
})
public class FsAsset implements Asset {
    private final Resource resource;
    private boolean isBatch;

    public FsAsset(Resource resource) {
        this.resource = resource;
    }

    @Override
    public String getPath() {
        return getFsResource().getPath();
    }

    @Override
    public String getName() {
        return getFsResource().getName();
    }

    @Override
    public String getMetadataValue(String s) {
        return (String) getFsResource().adaptTo(ValueMap.class).get(s);
    }

    @Override
    public Object getMetadata(String s) {
        return getFsResource().adaptTo(ValueMap.class).get(s);
    }

    @Override
    public long getLastModified() {
        return (Long) getFsResource().adaptTo(ValueMap.class).get(FsResource.CREATED);
    }

    @Override
    public Rendition getRendition(String s) {
        return null;
    }

    @Override
    public Rendition getOriginal() {
        return null;
    }

    @Override
    public Rendition getCurrentOriginal() {
        return null;
    }

    @Override
    public boolean isSubAsset() {
        return false;
    }

    @Override
    public Map<String, Object> getMetadata() {
        return resource.getResourceMetadata();
    }

    @Override
    public Resource setRendition(String s, InputStream inputStream, String s1) {
        return resource;
    }

    @Override
    public void setCurrentOriginal(String s) {

    }

    @Override
    public Revision createRevision(String s, String s1) throws Exception {
        return null;
    }

    @Override
    public List<Rendition> getRenditions() {
        return new ArrayList<>();
    }

    @Override
    public Iterator<Rendition> listRenditions() {
        return null;
    }

    @Override
    public Rendition getRendition(RenditionPicker renditionPicker) {
        return null;
    }

    @Override
    public String getModifier() {
        return null;
    }

    @Override
    public Asset restore(String s) throws Exception {
        return this;
    }

    @Override
    public Collection<Revision> getRevisions(Calendar calendar) throws Exception {
        return null;
    }

    @Override
    public String getMimeType() {
        return getFsResource().getMimeType();
    }

    @Override
    public Rendition addRendition(String s, InputStream inputStream, String s1) {
        return null;
    }

    @Override
    public Rendition addRendition(String s, InputStream inputStream, Map<String, Object> map) {
        return null;
    }

    @Override
    public Asset addSubAsset(String s, String s1, InputStream inputStream) {
        return this;
    }

    @Override
    public Collection<Asset> getSubAssets() {
        return new ArrayList<>();
    }

    @Override
    public void removeRendition(String s) {

    }

    @Override
    public void setBatchMode(boolean b) {
        isBatch = b;
    }

    @Override
    public boolean isBatchMode() {
        return isBatch;
    }

    @Override
    public <AdapterType> AdapterType adaptTo(Class<AdapterType> type) {
        if(type == Resource.class) {
            return (AdapterType) resource;
        }
        return null;
    }

    @Override
    public String toString() {
        return super.toString() + "\n" + resource;
    }

    private FsResource getFsResource() {
        return (FsResource) resource;
    }
}
