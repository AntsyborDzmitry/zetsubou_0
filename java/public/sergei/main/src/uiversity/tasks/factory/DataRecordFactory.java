package uiversity.tasks.factory;

import uiversity.tasks.api.DataRecord;
import uiversity.tasks.exceptions.DataRecordException;

public class DataRecordFactory {

    public static <T extends DataRecord> T build(Class<T> cl) throws DataRecordException {
        try {
            return cl.newInstance();
        } catch (InstantiationException | IllegalAccessException e) {
            throw new DataRecordException(e);
        }
    }
}
