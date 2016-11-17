package com.zetsubou_0.vadimtorus.kiryl.event.impl;

import com.zetsubou_0.vadimtorus.kiryl.coverter.EventConverterEnum;
import com.zetsubou_0.vadimtorus.kiryl.util.Constants;
import com.zetsubou_0.vadimtorus.kiryl.util.Writer;

public class ThirdEvent extends AbstractTwoExamEvent {

    private boolean thirdTest;

    public ThirdEvent(final double firstExamMark, final double secondExamMark, final boolean thirdTest) {
        super(firstExamMark, secondExamMark);
        this.thirdTest = thirdTest;
    }

    @Override
    public boolean isPassed() {
        return firstParamExamMark.compareTo(Constants.PASSED_MARK) >= 0
                && secondParamExamMark.compareTo(Constants.PASSED_MARK) >= 0
                && thirdTest;
    }

    @Override
    public String toString() {
        return new Writer(System.out).buildEventToString(EventConverterEnum.E1.getType(), firstParamExamMark,
                secondParamExamMark);
    }
}
