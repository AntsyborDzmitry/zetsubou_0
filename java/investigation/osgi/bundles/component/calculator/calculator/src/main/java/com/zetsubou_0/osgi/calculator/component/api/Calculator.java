package com.zetsubou_0.osgi.calculator.component.api;

import com.zetsubou_0.osgi.api.exception.OperationException;

/**
 * Created by Kiryl_Lutsyk on 9/28/2015.
 */
public interface Calculator {
    double calculate(String input) throws OperationException;
}
