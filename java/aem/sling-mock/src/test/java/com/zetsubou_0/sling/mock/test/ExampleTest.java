package com.zetsubou_0.sling.mock.test;

import com.google.common.collect.ImmutableMap;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.junit.SlingContext;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;

import static org.junit.Assert.*;

public class ExampleTest {

    @Rule
    public final SlingContext context = new SlingContext(ResourceResolverType.RESOURCERESOLVER_MOCK);

    private ResourceResolver resourceResolver;

    @Before
    public void setupGeneralBehavior() {
        resourceResolver = context.resourceResolver();

        context.create().resource("/content/sample/ca/en/auth/login", ImmutableMap.<String, Object>builder()
                .put("visibility", "all")
                .put("rating", 2)
                .build());

        context.build().resource("/content/test1")
                .siblingsMode()
                .resource("test1.1", "stringParam", "configValue1.1")
                .resource("test1.2", "stringParam", "configValue1.2")
                .resource("test1.2", "stringParam", "configValue1.3");
    }

    @Test
    public void shouldFindParentResource() {
        Resource resource = resourceResolver.getResource("/content/sample/ca/en");
        assertNotNull(resource);
    }

    @Test
    public void shouldReturnVisibility() {
        Resource resource = resourceResolver.getResource("/content/sample/ca/en/auth/login");
        ValueMap properties = resource.adaptTo(ValueMap.class);
        assertEquals("all", properties.get("visibility"));
    }

    @Test
    public void shouldFindSiblings() {
        Resource resource = resourceResolver.getResource("/content/test1");
    }
}
