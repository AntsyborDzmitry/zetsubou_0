package com.zetsubou_0.sling.test2.observer;

import org.osgi.service.event.EventHandler;

/**
 * Created by Kiryl_Lutsyk on 10/13/2015.
 */
public interface ResourceHandler extends EventHandler {
    public static final String CREATE_JOB = "custom/fs/create/job";
    public static final String UPDATE_JOB = "custom/fs/update/job";
    public static final String DELETE_JOB = "custom/fs/delete/job";
}
