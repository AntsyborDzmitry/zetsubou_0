package com.zetsubou_0.vadimtorus.kiryl.eums;

import com.zetsubou_0.vadimtorus.kiryl.coverter.FileRecordConverter;
import com.zetsubou_0.vadimtorus.kiryl.coverter.impl.*;
import com.zetsubou_0.vadimtorus.kiryl.util.Constants;

public enum FileEventConverterEnum {

    E1(FirstEventFileRecordConverter.class),
    E2(SecondEventFileRecordConverter.class),
    E3(ThirdEventFileRecordConverter.class),
    E4(FourthEventFileRecordConverter.class),
    E5(FifthEventFileRecordConverter.class);

    private final Class<? extends FileRecordConverter> eventConverterClass;

    FileEventConverterEnum(final Class<? extends FileRecordConverter> eventConverterClass) {
        this.eventConverterClass = eventConverterClass;
    }

    public Class<? extends FileRecordConverter> getEventConverterClass() {
        return eventConverterClass;
    }

    public static FileEventConverterEnum fromFileRecord(final String record) {
        String type = record.substring(0,
                record.indexOf(Constants.FileRecord.RECORD_DATA_SEPARATOR));
        return FileEventConverterEnum.valueOf(type.toUpperCase());
    }
}
