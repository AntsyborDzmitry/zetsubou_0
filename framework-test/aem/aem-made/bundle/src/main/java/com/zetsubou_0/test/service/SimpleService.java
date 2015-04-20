package com.zetsubou_0.test.service;

import org.apache.sling.api.resource.ResourceResolver;

/**
 * Created by zetsubou_0 on 20.04.15.
 */
public interface SimpleService {
    String hello();
    ResourceResolver getResolver();
}
