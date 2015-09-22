package com.zetsubou_0.osgi.operation.bpoperation;

import com.zetsubou_0.osgi.api.Operation;
import com.zetsubou_0.osgi.api.exception.OperationException;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;

@Component
public class BPOperation {
    @Reference
    private Operation operation;

    @Activate
    public void doSmth() {
        try {
            System.out.println(operation.getClass().getName());
            System.out.println(operation.execute(2, 5));
        } catch (OperationException e) {
            e.printStackTrace();
        }
    }
}
