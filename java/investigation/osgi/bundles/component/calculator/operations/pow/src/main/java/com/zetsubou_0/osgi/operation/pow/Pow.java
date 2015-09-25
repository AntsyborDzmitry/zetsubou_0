package com.zetsubou_0.osgi.operation.pow;

import com.zetsubou_0.osgi.api.Operation;
import com.zetsubou_0.osgi.api.exception.OperationException;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;

/**
 * Created by Kiryl_Lutsyk on 9/3/2015.
 */
@Component
@Service(value = Operation.class)
@Properties({
        @Property(name = Operation.OPERATION_NAME, value = "pow"),
        @Property(name = Operation.OPERATION_RANK, value = "30")})
public class Pow implements Operation {
    @Override
    public double execute(double left, double right) throws OperationException {
        return Math.pow(left, right);
    }
}
