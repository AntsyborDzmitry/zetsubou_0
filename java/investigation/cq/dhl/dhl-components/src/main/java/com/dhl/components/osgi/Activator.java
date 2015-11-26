package com.dhl.components.osgi;

import java.util.ArrayList;
import java.util.List;

import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;

import com.cognifide.slice.api.context.ContextScope;
import com.cognifide.slice.api.injector.InjectorRunner;
import com.cognifide.slice.commons.SliceModulesFactory;
import com.cognifide.slice.core.internal.context.SliceContextScope;
import com.cognifide.slice.cq.module.CQModulesFactory;
import com.cognifide.slice.validation.ValidationModulesFactory;
import com.dhl.components.module.ComponentContextModule;
import com.dhl.components.module.DHLModule;
import com.google.inject.Module;

/**
 * Bundle activator
 */
public class Activator implements BundleActivator {

    private static final String NAME_FILTER = "EWF\\..*";

    private static final String BASE_PACKAGE = "com.dhl";

    private static final String INJECTOR_NAME = "dhlApp";

    /**
     * Overrides start method behaviour
     */
    @Override
    public void start(BundleContext bundleContext) {
        initSlice(bundleContext);
    }

    private void initSlice(BundleContext bundleContext) {
        final ContextScope scope = new SliceContextScope();
        final InjectorRunner injectorRunner = new InjectorRunner(bundleContext, INJECTOR_NAME, scope);
        
        List<Module> sliceModules = SliceModulesFactory.createModules(bundleContext, 
                INJECTOR_NAME, NAME_FILTER, BASE_PACKAGE);
        List<Module> cqModules = CQModulesFactory.createModules();
        List<Module> validationModules = ValidationModulesFactory.createModules();
        List<Module> dhlModules = createCustomModules();

        injectorRunner.installModules(sliceModules);
        injectorRunner.installModules(cqModules);
        injectorRunner.installModules(validationModules);
        injectorRunner.installModules(dhlModules);

        injectorRunner.start();
    }

    private List<Module> createCustomModules() {
        List<Module> modules = new ArrayList<Module>();
        modules.add(new DHLModule());
        modules.add(new ComponentContextModule());
        return modules;
    }

    /**
     * Overrides stop method behaviour
     */
    @Override
    public void stop(BundleContext bundleContext) {
        // There is nothing to do on stop
    }
}