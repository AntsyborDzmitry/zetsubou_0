package com.zetsubou_0.vadimtorus.kiryl.coverter.impl;

import com.zetsubou_0.vadimtorus.kiryl.coverter.FileRecordConverter;
import com.zetsubou_0.vadimtorus.kiryl.event.Event;
import com.zetsubou_0.vadimtorus.kiryl.event.impl.FourthEvent;
import com.zetsubou_0.vadimtorus.kiryl.mark.Mark;
import com.zetsubou_0.vadimtorus.kiryl.util.Constants;

public class FourthEventFileRecordConverter implements FileRecordConverter {

    @Override
    public Event convert(final String record) {
        String[] parameters = record.split(Constants.RECORD_DATA_SEPARATOR);
        double mark1 = Mark.INTEGER10.valueOf(Integer.valueOf(parameters[1]));
        double mark2 = Mark.INTEGER10.valueOf(Integer.valueOf(parameters[2]));
        double mark3 = Mark.DOUBLE20.valueOf(Double.valueOf(parameters[3]));
        return new FourthEvent(mark1, mark2, mark3);
    }
}