package com.zetsubou_0.vadimtorus.kiryl.coverter.impl;

import com.zetsubou_0.vadimtorus.kiryl.coverter.FileRecordConverter;
import com.zetsubou_0.vadimtorus.kiryl.event.Event;
import com.zetsubou_0.vadimtorus.kiryl.event.impl.ThirdEvent;
import com.zetsubou_0.vadimtorus.kiryl.mark.Mark;
import com.zetsubou_0.vadimtorus.kiryl.util.Constants;

public class ThirdEventFileRecordConverter implements FileRecordConverter {

    @Override
    public Event convert(final String record) {
        String[] parameters = record.split(Constants.RECORD_DATA_SEPARATOR);
        double mark1 = Mark.DOUBLE10.valueOf(Integer.valueOf(parameters[1]));
        double mark2 = Mark.DOUBLE10.valueOf(Integer.valueOf(parameters[2]));
        boolean mark3 = Boolean.valueOf(parameters[3]);
        return new ThirdEvent(mark1, mark2, mark3);
    }
}