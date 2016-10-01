package com.zetsubou_0.vadimtorus.kiryl.event.impl;

import com.zetsubou_0.vadimtorus.kiryl.eums.EventConverterEnum;
import com.zetsubou_0.vadimtorus.kiryl.mark.impl.IntegerMark100;
import com.zetsubou_0.vadimtorus.kiryl.util.Constants;
import com.zetsubou_0.vadimtorus.kiryl.util.Writer;

public class FifthEvent extends AbstractOneExamEvent {

    private boolean firstTest;

    private boolean secondTest;

    public FifthEvent(final boolean firstTest, final boolean secondTest, final IntegerMark100<Integer> thirdExamMark) {
        super(thirdExamMark);
        this.firstTest = firstTest;
        this.secondTest = secondTest;
    }

    @Override
    public boolean isPassed() {
        return firstTest && secondTest && firstParamExamMark.getValue().intValue()
                >= Constants.PASSED_MARK_BOUNDS_100;
    }

    @Override
    public Double getMaxMark() {
        return firstParamExamMark.getValue().doubleValue();
    }

    @Override
    public String toString() {
        return new Writer(System.out).buildEventToString(EventConverterEnum.E5.getType(), firstTest, secondTest,
                firstParamExamMark.getValue());
    }
}
