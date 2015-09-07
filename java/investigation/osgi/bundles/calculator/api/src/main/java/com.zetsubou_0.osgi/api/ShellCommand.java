package com.zetsubou_0.osgi.api;

import com.zetsubou_0.osgi.api.exception.CommandException;

import java.util.Map;

/**
 * Created by Kiryl_Lutsyk on 9/2/2015.
 */
public interface ShellCommand {
    public static final String PATH = "path";
    public static final String PROTOCOL = "protocol";
    public static final String CACHE = "cache";
    public static final String BUNDLE_CONTEXT = "bundleContext";
    public static final String OPERATIONS = "operations";

    void execute(Map<String, Object> params) throws CommandException;
}
