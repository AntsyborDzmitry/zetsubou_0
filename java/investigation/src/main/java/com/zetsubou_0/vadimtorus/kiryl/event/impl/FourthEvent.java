package com.zetsubou_0.vadimtorus.kiryl.event.impl;

import com.zetsubou_0.vadimtorus.kiryl.eums.EventConverterEnum;
import com.zetsubou_0.vadimtorus.kiryl.mark.impl.DoubleMark20;
import com.zetsubou_0.vadimtorus.kiryl.mark.impl.IntegerMark10;
import com.zetsubou_0.vadimtorus.kiryl.util.Constants;
import com.zetsubou_0.vadimtorus.kiryl.util.Writer;

import java.util.TreeSet;

public class FourthEvent extends AbstractThreeExamsEvent {

    public FourthEvent(final IntegerMark10<Integer> firstExamMark, final IntegerMark10<Integer> secondExamMark,
                       final DoubleMark20<Double> thirdExamMark) {
        super(firstExamMark, secondExamMark, thirdExamMark);
    }

    @Override
    public boolean isPassed() {
        return firstParamExamMark.getValue().intValue() >= Constants.PASSED_MARK
                && secondParamExamMark.getValue().intValue() >= Constants.PASSED_MARK
                && thirdParamExamMark.getValue().doubleValue() >= Constants.PASSED_MARK_BOUNDS_20;
    }

    @Override
    public Double getMaxMark() {
        TreeSet<Double> marks = new TreeSet<>();
        marks.add(firstParamExamMark.getValue().doubleValue());
        marks.add(secondParamExamMark.getValue().doubleValue());
        marks.add(thirdParamExamMark.getValue().doubleValue());
        return marks.last();
    }

    @Override
    public String toString() {
        return new Writer(System.out).buildEventToString(EventConverterEnum.E4.getType(), firstParamExamMark.getValue(),
                secondParamExamMark.getValue(), thirdParamExamMark.getValue());
    }
}
