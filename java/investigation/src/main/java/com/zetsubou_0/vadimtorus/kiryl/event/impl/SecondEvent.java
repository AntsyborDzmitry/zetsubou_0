package com.zetsubou_0.vadimtorus.kiryl.event.impl;

import com.zetsubou_0.vadimtorus.kiryl.eums.EventConverterEnum;
import com.zetsubou_0.vadimtorus.kiryl.mark.impl.IntegerMark10;
import com.zetsubou_0.vadimtorus.kiryl.util.Constants;
import com.zetsubou_0.vadimtorus.kiryl.util.Writer;

public class SecondEvent extends AbstractTwoExamEvent {

    public SecondEvent(final IntegerMark10<Integer> firstExamMark, final IntegerMark10<Integer> secondExamMark) {
        super(firstExamMark, secondExamMark);
    }

    @Override
    public boolean isPassed() {
        return firstParamExamMark.getValue().intValue() >= Constants.PASSED_MARK
                && secondParamExamMark.getValue().intValue() >= Constants.PASSED_MARK;
    }

    @Override
    public Double getMaxMark() {
        return firstParamExamMark.getValue().intValue() > secondParamExamMark.getValue().intValue()
                ? firstParamExamMark.getValue().doubleValue()
                : secondParamExamMark.getValue().doubleValue();
    }


    @Override
    public String toString() {
        return new Writer(System.out).buildEventToString(EventConverterEnum.E1.getType(), firstParamExamMark.getValue(),
                secondParamExamMark.getValue());
    }
}
