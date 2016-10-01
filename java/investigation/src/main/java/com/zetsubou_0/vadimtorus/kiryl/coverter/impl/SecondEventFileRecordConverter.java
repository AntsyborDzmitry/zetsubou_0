package com.zetsubou_0.vadimtorus.kiryl.coverter.impl;

import com.zetsubou_0.vadimtorus.kiryl.coverter.FileRecordConverter;
import com.zetsubou_0.vadimtorus.kiryl.event.Event;
import com.zetsubou_0.vadimtorus.kiryl.event.impl.SecondEvent;
import com.zetsubou_0.vadimtorus.kiryl.mark.impl.IntegerMark10;
import com.zetsubou_0.vadimtorus.kiryl.util.Constants;

public class SecondEventFileRecordConverter implements FileRecordConverter {

    @Override
    public Event convert(final String record) {
        String[] parameters = record.split(Constants.FileRecord.RECORD_DATA_SEPARATOR);
        IntegerMark10 mark1 = new IntegerMark10(Integer.parseInt(parameters[1]));
        IntegerMark10 mark2 = new IntegerMark10(Integer.parseInt(parameters[2]));
        return new SecondEvent(mark1, mark2);
    }
}