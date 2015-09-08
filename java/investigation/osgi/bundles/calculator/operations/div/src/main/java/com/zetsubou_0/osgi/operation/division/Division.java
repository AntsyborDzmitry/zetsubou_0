package com.zetsubou_0.osgi.operation.division;

import com.zetsubou_0.osgi.api.Operation;
import com.zetsubou_0.osgi.api.exception.OperationException;

/**
 * Created by Kiryl_Lutsyk on 9/8/2015.
 */
public class Division implements Operation {
    @Override
    public double execute(double left, double right) throws OperationException {
        return left / right;
    }
}
