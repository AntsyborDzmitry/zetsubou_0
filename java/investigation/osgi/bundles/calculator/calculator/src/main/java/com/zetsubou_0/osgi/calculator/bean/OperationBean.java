package com.zetsubou_0.osgi.calculator.bean;

/**
 * Created by Kiryl_Lutsyk on 9/7/2015.
 */
public class OperationBean {
    private String operation;
    private String className;
    private int rank;

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    public int getRank() {
        return rank;
    }

    public void setRank(int rank) {
        this.rank = rank;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }
}
