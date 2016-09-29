package com.zetsubou_0.vadimtorus.kiryl.eums;

import com.zetsubou_0.vadimtorus.kiryl.coverter.EventConverter;
import com.zetsubou_0.vadimtorus.kiryl.coverter.impl.*;

public enum FileEventConverterEnum {

    E1(FirstEventConverter.class),
    E2(SecondEventConverter.class),
    E3(ThirdEventConverter.class),
    E4(FourthEventConverter.class),
    E5(FifthEventConverter.class);

    private final Class<? extends EventConverter> eventConverterClass;

    FileEventConverterEnum(final Class<? extends EventConverter> eventConverterClass) {
        this.eventConverterClass = eventConverterClass;
    }

    public Class<? extends EventConverter> getEventConverterClass() {
        return eventConverterClass;
    }

    public static FileEventConverterEnum fromFileRecord(final String record) {
        String type = record.substring(0, record.indexOf(";"));
        return FileEventConverterEnum.valueOf(type.toUpperCase());
    }
}
