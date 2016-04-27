package uiversity.tasks.impl;

import uiversity.tasks.api.DataRecord;
import uiversity.tasks.exceptions.DataRecordException;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StudentDataRecord implements DataRecord {

    private static final String LINE_REGEX = "([\\w\\s]+)\\s*,\\s*([1-6])\\s*,\\s*([\\d.]+)\\s*";

    private static final Pattern PATTERN = Pattern.compile(LINE_REGEX);

    private static final int AVERAGE_SCORE_GROUP = 3;

    public StudentDataRecord() {
    }

    @Override
    public double getValue(final String record) throws DataRecordException {
        if (!record.matches(LINE_REGEX)) {
            throw new DataRecordException("Illegal record format. " + record);
        }
        Matcher matcher = PATTERN.matcher(record);
        if (matcher.find()) {
            return Double.parseDouble(matcher.group(AVERAGE_SCORE_GROUP));
        }
        throw new DataRecordException("Average score not found in " + record);
    }
}
