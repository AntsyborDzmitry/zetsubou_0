package com.zetsubou_0.vadimtorus.kiryl.eums;

import com.zetsubou_0.vadimtorus.kiryl.coverter.FileRecordConverter;
import com.zetsubou_0.vadimtorus.kiryl.coverter.impl.*;
import com.zetsubou_0.vadimtorus.kiryl.util.Constants;

public enum EventConverterEnum {

    E1(FirstEventFileRecordConverter.class, "FirstEvent"),
    E2(SecondEventFileRecordConverter.class, "SecondEvent"),
    E3(ThirdEventFileRecordConverter.class, "ThirdEvent"),
    E4(FourthEventFileRecordConverter.class, "FourthEvent"),
    E5(FifthEventFileRecordConverter.class, "FifthEvent");

    private final Class<? extends FileRecordConverter> eventConverterClass;

    private final String type;

    EventConverterEnum(final Class<? extends FileRecordConverter> eventConverterClass, final String type) {
        this.eventConverterClass = eventConverterClass;
        this.type = type;
    }

    public Class<? extends FileRecordConverter> getEventConverterClass() {
        return eventConverterClass;
    }

    public String getType() {
        return type;
    }

    public static EventConverterEnum fromFileRecord(final String record) {
        String type = record.substring(0, record.indexOf(Constants.RECORD_DATA_SEPARATOR));
        return EventConverterEnum.valueOf(type.toUpperCase());
    }
}
