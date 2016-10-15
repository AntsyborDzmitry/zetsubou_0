package com.zetsubou_0.vadimtorus.kiryl.event.impl;

import com.zetsubou_0.vadimtorus.kiryl.coverter.EventConverterEnum;
import com.zetsubou_0.vadimtorus.kiryl.util.Constants;
import com.zetsubou_0.vadimtorus.kiryl.util.Writer;

public class FifthEvent extends AbstractOneExamEvent {

    private boolean firstTest;

    private boolean secondTest;

    public FifthEvent(final boolean firstTest, final boolean secondTest, final double thirdExamMark) {
        super(thirdExamMark);
        this.firstTest = firstTest;
        this.secondTest = secondTest;
    }

    @Override
    public boolean isPassed() {
        return firstTest && secondTest && firstParamExamMark.compareTo(Constants.PASSED_MARK_BOUNDS_100) >= 0;
    }

    @Override
    public String toString() {
        return new Writer(System.out).buildEventToString(EventConverterEnum.E5.getType(), firstTest, secondTest,
                firstParamExamMark);
    }
}
