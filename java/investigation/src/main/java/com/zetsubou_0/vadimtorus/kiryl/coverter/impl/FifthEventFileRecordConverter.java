package com.zetsubou_0.vadimtorus.kiryl.coverter.impl;

import com.zetsubou_0.vadimtorus.kiryl.coverter.FileRecordConverter;
import com.zetsubou_0.vadimtorus.kiryl.event.Event;
import com.zetsubou_0.vadimtorus.kiryl.event.impl.FifthEvent;
import com.zetsubou_0.vadimtorus.kiryl.mark.Mark;
import com.zetsubou_0.vadimtorus.kiryl.util.Constants;

public class FifthEventFileRecordConverter implements FileRecordConverter {

    @Override
    public Event convert(final String record) {
        String[] parameters = record.split(Constants.RECORD_DATA_SEPARATOR);
        boolean mark1 = Boolean.valueOf(parameters[1]);
        boolean mark2 = Boolean.valueOf(parameters[2]);
        double mark3 = Mark.INTEGER100.valueOf(Integer.valueOf(parameters[3]));
        return new FifthEvent(mark1, mark2, mark3);
    }
}