package com.zetsubou_0.vadimtorus.kiryl.event.impl;

import com.zetsubou_0.vadimtorus.kiryl.eums.EventConverterEnum;
import com.zetsubou_0.vadimtorus.kiryl.mark.impl.DoubleMark10;
import com.zetsubou_0.vadimtorus.kiryl.util.Constants;
import com.zetsubou_0.vadimtorus.kiryl.util.Writer;

public class ThirdEvent extends AbstractTwoExamEvent {

    private boolean thirdTest;

    public ThirdEvent(final DoubleMark10 firstExamMark, final DoubleMark10 secondExamMark, final boolean thirdTest) {
        super(firstExamMark, secondExamMark);
        this.thirdTest = thirdTest;
    }

    @Override
    public boolean isPassed() {
        return firstParamExamMark.getValue().intValue() >= Constants.PASSED_MARK
                && secondParamExamMark.getValue().intValue() >= Constants.PASSED_MARK
                && thirdTest;
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
