package uiversity.tasks.api;

import uiversity.tasks.exceptions.DataRecordException;

public interface DataRecord {
    double getValue(String record) throws DataRecordException;
}
