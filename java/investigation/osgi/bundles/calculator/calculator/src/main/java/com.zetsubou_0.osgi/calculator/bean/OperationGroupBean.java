package com.zetsubou_0.osgi.calculator.bean;

import com.zetsubou_0.osgi.api.Operation;
import com.zetsubou_0.osgi.api.exception.OperationException;

/**
 * Created by Kiryl_Lutsyk on 9/7/2015.
 */
public class OperationGroupBean {
    protected Operation operation;
    protected OperationGroupBean leftGroup;
    protected OperationGroupBean rightGroup;
    protected double left;
    protected double right;
    protected boolean isLeftComplicated;
    protected boolean isRightComplicated;

    public Operation getOperation() {
        return operation;
    }

    public void setOperation(Operation operation) {
        this.operation = operation;
    }

    public OperationGroupBean getLeftGroup() {
        return leftGroup;
    }

    public void setLeftGroup(OperationGroupBean leftGroup) {
        this.leftGroup = leftGroup;
    }

    public OperationGroupBean getRightGroup() {
        return rightGroup;
    }

    public void setRightGroup(OperationGroupBean rightGroup) {
        this.rightGroup = rightGroup;
    }

    public double getLeft() {
        return left;
    }

    public void setLeft(double left) {
        this.left = left;
    }

    public double getRight() {
        return right;
    }

    public void setRight(double right) {
        this.right = right;
    }

    public boolean isLeftComplicated() {
        return isLeftComplicated;
    }

    public void setLeftComplicated(boolean isLeftComplicated) {
        this.isLeftComplicated = isLeftComplicated;
    }

    public boolean isRightComplicated() {
        return isRightComplicated;
    }

    public void setRightComplicated(boolean isRightComplicated) {
        this.isRightComplicated = isRightComplicated;
    }

    public double getValue() throws OperationException {
        double right;
        if(isRightComplicated) {
            right = rightGroup.getValue();
        } else {
            right = this.right;
        }

        double left;
        if(isLeftComplicated) {
            left = leftGroup.getValue();
        } else {
            left = this.left;
        }

        return operation.execute(left, right);
    }
}
