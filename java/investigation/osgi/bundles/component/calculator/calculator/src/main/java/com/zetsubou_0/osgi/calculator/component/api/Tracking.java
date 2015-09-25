package com.zetsubou_0.osgi.calculator.component.api;

import org.osgi.framework.Bundle;

import java.util.Set;

/**
 * Created by Kiryl_Lutsyk on 9/25/2015.
 */
public interface Tracking {
    void startTracking();
    void stopTracking();
    Set<Bundle> getCache();
}