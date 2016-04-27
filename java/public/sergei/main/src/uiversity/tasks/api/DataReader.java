package uiversity.tasks.api;

import uiversity.tasks.exceptions.DataRecordException;

public interface DataReader <T extends DataRecord> {
    String getMax(final Class<? extends T> cl) throws DataRecordException;

    String getMin(final Class<? extends T> cl) throws DataRecordException;
}
