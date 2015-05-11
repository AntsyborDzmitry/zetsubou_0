package com.zetsubou_0.test.service;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;

/**
* Created by zetsubou_0 on 20.04.15.
*/
@Component(immediate = true, metatype = false)
@Service(SimpleService.class)
public class SimpleServiceImpl implements SimpleService {
    @Reference
    private ResourceResolverFactory factory;

    @Override
    public String hello() {
        return "hello";
    }

    @Override
    public ResourceResolver getResolver() {
        try {
            return factory.getAdministrativeResourceResolver(null);
        } catch (LoginException e) {
            e.printStackTrace();
        }
        return null;
    }
}
