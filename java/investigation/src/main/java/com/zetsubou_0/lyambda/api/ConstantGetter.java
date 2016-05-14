package com.zetsubou_0.lyambda.api;

public interface ConstantGetter {

    default int defaultNumber() {
        return 0;
    }

    int getNumber();
}
