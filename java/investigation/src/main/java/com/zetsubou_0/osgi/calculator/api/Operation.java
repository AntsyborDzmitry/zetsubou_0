package com.zetsubou_0.osgi.calculator.api;

import com.zetsubou_0.osgi.calculator.api.exception.OperationException;

/**
 * Created by Kiryl_Lutsyk on 9/2/2015.
 */
public interface Operation {
    void execute() throws OperationException;
}
