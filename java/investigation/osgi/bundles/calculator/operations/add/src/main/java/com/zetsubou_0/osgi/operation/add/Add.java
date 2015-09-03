package com.zetsubou_0.osgi.operation.add;

import com.zetsubou_0.osgi.api.Operation;
import com.zetsubou_0.osgi.api.exception.OperationException;

/**
 * Created by Kiryl_Lutsyk on 9/3/2015.
 */
public class Add implements Operation {
    @Override
    public void execute() throws OperationException {
        System.out.println("Add something");
    }
}
