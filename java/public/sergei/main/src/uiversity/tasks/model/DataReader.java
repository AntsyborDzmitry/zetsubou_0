package uiversity.tasks.model;

import uiversity.tasks.api.DataRecord;
import uiversity.tasks.exceptions.DataRecordException;
import uiversity.tasks.factory.DataRecordFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

public class DataReader<T extends DataRecord> {
    private static final String FILE_PATH = "in.txt";

    private List<String> records = new ArrayList<>();

    public DataReader() {
        try {
            records = Files.readAllLines(Paths.get(FILE_PATH));
        } catch (IOException e) {
            System.err.println(e.getMessage());
        }
    }

    public String getMax(final Class<? extends T> cl) throws DataRecordException {
        T dataRecord = DataRecordFactory.build(cl);
        String result = "";
        double max = Double.MIN_VALUE;
        for (String record : records) {
            double newMax = Math.max(dataRecord.getValue(record), max);
            if (newMax != max) {
                result = record;
            }
            max = newMax;
        }
        return result;
    }

    public String getMin(final Class<? extends T> cl) throws DataRecordException {
        T dataRecord = DataRecordFactory.build(cl);
        String result = "";
        double min = Double.MAX_VALUE;
        for (String record : records) {
            double newMin = Math.min(dataRecord.getValue(record), min);
            if (newMin != min) {
                result = record;
            }
            min = newMin;
        }
        return result;
    }
}
