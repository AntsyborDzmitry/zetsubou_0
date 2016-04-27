package uiversity.tasks;

import uiversity.tasks.api.DataRecord;
import uiversity.tasks.exceptions.DataRecordException;
import uiversity.tasks.impl.FloatDataRecord;
import uiversity.tasks.impl.StudentDataRecord;
import uiversity.tasks.model.DataReader;

public class Task7 {
    public static void main(String[] args) {
        DataReader<DataRecord> dataReader = new DataReader<>();
        try {
            System.out.println(dataReader.getMin(StudentDataRecord.class));
            System.out.println(dataReader.getMax(StudentDataRecord.class));
        } catch (DataRecordException e) {
            System.err.println(e.getMessage());
        }
    }
}
