package com.zetsubou_0.mousemover.util.operation;

import java.io.IOException;

/**
 * Created by zetsubou_0 on 14.02.15.
 */
public class OperaionLinux implements Operation {
    public static final String GET_PROCESS_LIST = "ps -eo cmd";
    private String operation;
    private Process process;

    @Override
    public void perform() {
        Runtime runtime = Runtime.getRuntime();
        try {
            process = runtime.exec(getOperation());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public Object getResult() {
        return process;
    }

    @Override
    public String getOperation() {
        return operation;
    }

    @Override
    public void setOperation(String operation) {
        this.operation = operation;
    }
}
