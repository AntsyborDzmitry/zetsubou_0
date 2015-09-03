package com.zetsubou_0.osgi.api;

import com.zetsubou_0.osgi.api.exception.OperationException;

/**
 * Created by Kiryl_Lutsyk on 9/2/2015.
 */
public interface Operation {
    public static String OPERATION_BASE_CLASS = "Operation-base-class";
    public static String OPERATION_NAME = "Operation-name";
    public static String OPERATION_CLASS = "Operation-class";
    public static String OPERATION_RANK = "Operation-rank";

    double execute(double left, double right) throws OperationException;
}
