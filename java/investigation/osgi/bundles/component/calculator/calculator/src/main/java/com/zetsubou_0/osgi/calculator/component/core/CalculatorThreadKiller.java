package com.zetsubou_0.osgi.calculator.component.core;

import com.zetsubou_0.osgi.calculator.component.api.ThreadKiller;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.osgi.framework.Bundle;
import org.osgi.framework.BundleException;

/**
 * Created by Kiryl_Lutsyk on 9/4/2015.
 */
@Component
@Service(value = {ThreadKiller.class})
public class CalculatorThreadKiller implements ThreadKiller {
    private Bundle bundle;

    public CalculatorThreadKiller() {}

    @Override
    public void run() {
        try {
            bundle.stop();
        } catch (BundleException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void setBundle(Bundle bundle) {
        this.bundle = bundle;
    }
}
