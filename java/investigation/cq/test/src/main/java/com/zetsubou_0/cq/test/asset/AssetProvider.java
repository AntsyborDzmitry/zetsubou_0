package com.zetsubou_0.cq.test.asset;

import com.day.cq.dam.api.AssetManager;
import com.zetsubou_0.cq.test.asset.resource.AssetResource;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.*;
import org.apache.felix.scr.annotations.Properties;
import org.apache.sling.api.resource.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.*;

/**
 * Created by Kiryl_Lutsyk on 10/20/2015.
 */
@Component(
        name = AssetProvider.COMPONENT_NAME,
        label="Custom Assets Provider",
        description="Custom Assets Provider",
        configurationFactory=true,
        policy= ConfigurationPolicy.REQUIRE,
        metatype=true
)
@Service
@Properties({
        @Property(name = AssetProvider.COMPONENT_PROPERTY, value = AssetProvider.COMPONENT_NAME, propertyPrivate = true),
        @Property(name="service.description", value="Test Asset Resource Provider"),
        @Property(name="service.vendor", value="Test Asset")
})
public class AssetProvider implements ResourceProvider {
    public static final String COMPONENT_NAME = "com.zetsubou_0.cq.test.asset.AssetProvider";
    public static final String COMPONENT_PROPERTY = "componentName";
    public static final String IMAGE_PATH = "imageResource";

    private static final Logger LOG = LoggerFactory.getLogger(AssetProvider.class);
    private static final String URL_PATH = "https://avatars.yandex.net/get-music-content/b57d4693.p.45653/200x200";

    /**
     * Mount point into sling repository
     */
    @Property(label = "Mount point into sling repository", description = "Mount point into sling repository", value = "/content/dam/test")
    public static final String SLING_MOUNT_POINT = ResourceProvider.ROOTS;

    @Reference(cardinality = ReferenceCardinality.OPTIONAL_UNARY, policy = ReferencePolicy.DYNAMIC)
    private ResourceResolverFactory resourceResolverFactory;

    private Map<String, Object> properties;
    private String slingMountPoint;
    private ResourceResolver resourceResolver;
    private Resource root;

    @Override
    public Resource getResource(ResourceResolver resourceResolver, HttpServletRequest httpServletRequest, String s) {
        return getResource(resourceResolver, s);
    }

    @Override
    public Resource getResource(ResourceResolver resourceResolver, String path) {
        try {
            URL url = new URI(URL_PATH).toURL();
            if(StringUtils.isNotBlank(path) && path.startsWith(slingMountPoint)) {
                if(slingMountPoint.equals(path)) {
                    return new SyntheticResource(resourceResolver, slingMountPoint, AssetResource.RESOURCE_TYPE);
                } else {
                    if(!path.contains(IMAGE_PATH)) {
                        Resource resource = new AssetResource(this, url);
                        AssetManager assetManager = resourceResolver.adaptTo(AssetManager.class);
                        try {
                            assetManager.createAsset(resource.getPath() + "/" + IMAGE_PATH, ((AssetResource) resource).getInputStream(), ((AssetResource) resource).getMimeType(), false);
                        } catch (IOException e) {
                            LOG.error(e.getMessage(), e);
                        }
                        return resource;
                    }
                }
            }
        } catch (MalformedURLException | URISyntaxException e) {
            LOG.error(e.getMessage(), e);
        }
        return null;
    }

    @Override
    public Iterator<Resource> listChildren(Resource resource) {
        // only for test
        List<Resource> resources = new ArrayList<>();
        if(root.getPath().equals(resource.getPath())) {
            try {
                resources.add(new AssetResource(this, new URI(URL_PATH).toURL()));
            } catch (MalformedURLException | URISyntaxException e) {
                LOG.error(e.getMessage(), e);
            }
        }
        return resources.iterator();
    }

    public Map<String, Object> getProperties() {
        return properties;
    }

    public String getSlingMountPoint() {
        return slingMountPoint;
    }

    public ResourceResolver getResourceResolver() {
        return resourceResolver;
    }

    @Activate
    protected void activate(Map<String, Object> properties) {
        this.properties = properties;
        this.slingMountPoint = (String) properties.get(SLING_MOUNT_POINT);
        try {
            this.resourceResolver = resourceResolverFactory.getAdministrativeResourceResolver(null);
        } catch (LoginException e) {
            LOG.error(e.getMessage(), e);
        }
        root = getResource(resourceResolver, slingMountPoint);
    }
}
