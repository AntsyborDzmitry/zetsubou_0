package com.zetsubou_0.vadimtorus.kiryl.coverter.impl;

import com.zetsubou_0.vadimtorus.kiryl.coverter.FileRecordConverter;
import com.zetsubou_0.vadimtorus.kiryl.event.Event;
import com.zetsubou_0.vadimtorus.kiryl.event.impl.SecondEvent;
import com.zetsubou_0.vadimtorus.kiryl.mark.Mark;
import com.zetsubou_0.vadimtorus.kiryl.util.Constants;

public class SecondEventFileRecordConverter implements FileRecordConverter {

    @Override
    public Event convert(final String record) {
        String[] parameters = record.split(Constants.RECORD_DATA_SEPARATOR);
        double mark1 = Mark.INTEGER10.valueOf(Integer.valueOf(parameters[1]));
        double mark2 = Mark.INTEGER10.valueOf(Integer.valueOf(parameters[2]));
        return new SecondEvent(mark1, mark2);
    }
}