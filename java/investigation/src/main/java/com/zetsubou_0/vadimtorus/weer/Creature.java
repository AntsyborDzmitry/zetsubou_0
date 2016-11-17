package com.zetsubou_0.vadimtorus.weer;

import java.util.List;

public interface Creature {

    void printInfo();

    int getEyesNum();

    void collect(List<Creature> creatures);
}
