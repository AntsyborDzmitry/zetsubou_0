package com.zetsubou_0.osgi.calculator.component.api;

import org.osgi.framework.Bundle;

/**
 * Created by Kiryl_Lutsyk on 9/25/2015.
 */
public interface ThreadKiller extends Runnable {
    void setBundle(Bundle bundle);
}
