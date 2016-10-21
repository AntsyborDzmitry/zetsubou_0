package com.zetsubou_0.vadimtorus.kiryl.event.impl;

import com.zetsubou_0.vadimtorus.kiryl.coverter.EventConverterEnum;
import com.zetsubou_0.vadimtorus.kiryl.util.Constants;
import com.zetsubou_0.vadimtorus.kiryl.util.Writer;

public class FourthEvent extends AbstractThreeExamsEvent {

    public FourthEvent(final double firstExamMark, final double secondExamMark, final double thirdExamMark) {
        super(firstExamMark, secondExamMark, thirdExamMark);
    }

    @Override
    public boolean isPassed() {
        return new Double(firstParamExamMark + secondParamExamMark + thirdParamExamMark)
                .compareTo(Constants.PASSED_SUM_THREE_EXAMS) >= 0;
    }

    @Override
    public String toString() {
        return new Writer(System.out).buildEventToString(EventConverterEnum.E4.getType(), firstParamExamMark,
                secondParamExamMark, thirdParamExamMark);
    }
}
