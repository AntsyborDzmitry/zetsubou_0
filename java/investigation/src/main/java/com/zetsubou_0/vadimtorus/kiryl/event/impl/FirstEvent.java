package com.zetsubou_0.vadimtorus.kiryl.event.impl;

import com.zetsubou_0.vadimtorus.kiryl.coverter.EventConverterEnum;
import com.zetsubou_0.vadimtorus.kiryl.util.Constants;
import com.zetsubou_0.vadimtorus.kiryl.util.Writer;

public class FirstEvent extends AbstractTwoExamEvent {

    public FirstEvent(final double firstExamMark, final double secondExamMark) {
        super(firstExamMark, secondExamMark);
    }

    @Override
    public boolean isPassed() {
        return new Double(firstParamExamMark + secondParamExamMark).compareTo(Constants.PASSED_SUM) >= 0;
    }

    @Override
    public String toString() {
        return new Writer(System.out).buildEventToString(EventConverterEnum.E1.getType(), firstParamExamMark,
                secondParamExamMark);
    }
}
