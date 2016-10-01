package com.zetsubou_0.vadimtorus.kiryl.coverter.impl;

import com.zetsubou_0.vadimtorus.kiryl.coverter.FileRecordConverter;
import com.zetsubou_0.vadimtorus.kiryl.event.Event;
import com.zetsubou_0.vadimtorus.kiryl.event.impl.FourthEvent;
import com.zetsubou_0.vadimtorus.kiryl.mark.impl.DoubleMark20;
import com.zetsubou_0.vadimtorus.kiryl.mark.impl.IntegerMark10;
import com.zetsubou_0.vadimtorus.kiryl.util.Constants;

public class FourthEventFileRecordConverter implements FileRecordConverter {

    @Override
    public Event convert(final String record) {
        String[] parameters = record.split(Constants.RECORD_DATA_SEPARATOR);
        IntegerMark10<Integer> mark1 = new IntegerMark10<>(Integer.valueOf(parameters[1]));
        IntegerMark10<Integer> mark2 = new IntegerMark10<>(Integer.valueOf(parameters[2]));
        DoubleMark20<Double> mark3 = new DoubleMark20<>(Double.valueOf(parameters[3]));
        return new FourthEvent(mark1, mark2, mark3);
    }
}