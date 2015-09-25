package com.zetsubou_0.osgi.calculator.component.core;

import com.zetsubou_0.osgi.calculator.component.api.BundleContextProvider;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.osgi.framework.BundleContext;
import org.osgi.service.component.ComponentContext;

/**
 * Created by Kiryl_Lutsyk on 9/25/2015.
 */
@Component
@Service(value = BundleContextProvider.class)
public class BundleContextProviderImpl implements BundleContextProvider {
    private BundleContext bundleContext;

    @Activate
    protected void activate(ComponentContext componentContext) {
        bundleContext = componentContext.getBundleContext();
    }

    @Override
    public BundleContext getBundleContext() {
        return bundleContext;
    }
}
