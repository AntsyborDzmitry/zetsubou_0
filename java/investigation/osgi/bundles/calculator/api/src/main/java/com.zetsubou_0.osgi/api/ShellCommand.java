package com.zetsubou_0.osgi.api;

import com.zetsubou_0.osgi.api.exception.CommandExxeption;

import java.util.Map;

/**
 * Created by Kiryl_Lutsyk on 9/2/2015.
 */
public interface ShellCommand {
    public static final String BUNDLE = "bundle";
    public static final String BUNDLE_CONTEXT = "bundleContext";

    void execute(Map<String, Object> params) throws CommandExxeption;
}
