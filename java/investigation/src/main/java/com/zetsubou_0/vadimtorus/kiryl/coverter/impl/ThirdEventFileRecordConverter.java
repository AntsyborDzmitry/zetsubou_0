package com.zetsubou_0.vadimtorus.kiryl.coverter.impl;

import com.zetsubou_0.vadimtorus.kiryl.coverter.FileRecordConverter;
import com.zetsubou_0.vadimtorus.kiryl.event.Event;
import com.zetsubou_0.vadimtorus.kiryl.event.impl.ThirdEvent;
import com.zetsubou_0.vadimtorus.kiryl.mark.impl.DoubleMark10;
import com.zetsubou_0.vadimtorus.kiryl.util.Constants;

public class ThirdEventFileRecordConverter implements FileRecordConverter {

    @Override
    public Event convert(final String record) {
        String[] parameters = record.split(Constants.FileRecord.RECORD_DATA_SEPARATOR);
        DoubleMark10 mark1 = new DoubleMark10(Double.parseDouble(parameters[1]));
        DoubleMark10 mark2 = new DoubleMark10(Double.parseDouble(parameters[2]));
        boolean mark3 = Boolean.parseBoolean(parameters[3]);
        return new ThirdEvent(mark1, mark2, mark3);
    }
}