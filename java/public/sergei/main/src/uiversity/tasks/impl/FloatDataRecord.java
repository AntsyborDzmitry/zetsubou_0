package uiversity.tasks.impl;

import uiversity.tasks.api.DataRecord;
import uiversity.tasks.exceptions.DataRecordException;

import java.util.regex.Pattern;

public class FloatDataRecord implements DataRecord {

    private static final String LINE_REGEX = "(([\\d+|.]+)\\s*)+";

    private static final String REGEX = "(\\s)+";

    private static final Pattern PATTERN = Pattern.compile(REGEX);

    public FloatDataRecord() {
    }

    @Override
    public double getValue(final String record) throws DataRecordException {
        if (!record.matches(LINE_REGEX)) {
            throw new DataRecordException("Illegal record format. " + record);
        }
        return PATTERN.splitAsStream(record)
                .mapToDouble(Double::parseDouble)
                .sum();
    }

}
