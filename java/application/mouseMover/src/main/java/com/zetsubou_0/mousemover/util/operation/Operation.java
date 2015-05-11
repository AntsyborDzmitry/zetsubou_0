package com.zetsubou_0.mousemover.util.operation;

/**
 * Created by zetsubou_0 on 14.02.15.
 */
public interface Operation {
    void perform();
    Object getResult();
    String getOperation();
    void setOperation(String operation);
}
