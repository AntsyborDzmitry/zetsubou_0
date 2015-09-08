package com.zetsubou_0.osgi.operation.pow;

import com.zetsubou_0.osgi.api.Operation;
import com.zetsubou_0.osgi.api.exception.OperationException;

/**
 * Created by Kiryl_Lutsyk on 9/3/2015.
 */
public class Pow implements Operation {
    @Override
    public double execute(double left, double right) throws OperationException {
        return Math.pow(left, right);
    }
}
