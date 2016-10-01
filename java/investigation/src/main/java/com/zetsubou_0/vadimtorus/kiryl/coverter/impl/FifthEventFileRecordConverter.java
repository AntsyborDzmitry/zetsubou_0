package com.zetsubou_0.vadimtorus.kiryl.coverter.impl;

import com.zetsubou_0.vadimtorus.kiryl.coverter.FileRecordConverter;
import com.zetsubou_0.vadimtorus.kiryl.event.Event;
import com.zetsubou_0.vadimtorus.kiryl.event.impl.FifthEvent;
import com.zetsubou_0.vadimtorus.kiryl.mark.impl.IntegerMark100;
import com.zetsubou_0.vadimtorus.kiryl.util.Constants;

public class FifthEventFileRecordConverter implements FileRecordConverter {

    @Override
    public Event convert(final String record) {
        String[] parameters = record.split(Constants.FileRecord.RECORD_DATA_SEPARATOR);
        boolean mark1 = Boolean.parseBoolean(parameters[1]);
        boolean mark2 = Boolean.parseBoolean(parameters[2]);
        IntegerMark100 mark3 = new IntegerMark100(Integer.parseInt(parameters[3]));
        return new FifthEvent(mark1, mark2, mark3);
    }
}