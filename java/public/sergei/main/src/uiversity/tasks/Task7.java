package uiversity.tasks;

import uiversity.tasks.api.DataReader;
import uiversity.tasks.api.DataRecord;
import uiversity.tasks.exceptions.DataRecordException;
import uiversity.tasks.impl.FloatDataRecord;
import uiversity.tasks.impl.DataReaderImpl;
import uiversity.tasks.impl.StudentDataRecord;

public class Task7 {
    public static void main(String[] args) {
        DataReader<DataRecord> dataReader = new DataReaderImpl<>();
        try {
            System.out.println(dataReader.getMin(StudentDataRecord.class));
            System.out.println(dataReader.getMax(StudentDataRecord.class));
        } catch (DataRecordException e) {
            System.err.println(e.getMessage());
        }
    }
}
