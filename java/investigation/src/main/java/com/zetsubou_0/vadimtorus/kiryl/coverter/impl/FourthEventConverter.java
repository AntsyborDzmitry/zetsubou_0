package com.zetsubou_0.vadimtorus.kiryl.coverter.impl;

import com.zetsubou_0.vadimtorus.kiryl.coverter.EventConverter;
import com.zetsubou_0.vadimtorus.kiryl.event.Event;
import com.zetsubou_0.vadimtorus.kiryl.event.impl.FourthEvent;
import com.zetsubou_0.vadimtorus.kiryl.mark.impl.DoubleMark20;
import com.zetsubou_0.vadimtorus.kiryl.mark.impl.IntegerMark10;

public class FourthEventConverter implements EventConverter {

    @Override
    public Event convert(final String record) {
        String[] parameters = record.split(DATA_SEPARATOR);
        IntegerMark10 mark1 = new IntegerMark10(Integer.parseInt(parameters[1]));
        IntegerMark10 mark2 = new IntegerMark10(Integer.parseInt(parameters[2]));
        DoubleMark20 mark3 = new DoubleMark20(Double.parseDouble(parameters[3]));
        return new FourthEvent(mark1, mark2, mark3);
    }
}