package uiversity.tasks.exceptions;

public class DataRecordException extends Exception {
    public DataRecordException() {
    }

    public DataRecordException(final String s) {
        super(s);
    }

    public DataRecordException(final String s, final Throwable throwable) {
        super(s, throwable);
    }

    public DataRecordException(final Throwable throwable) {
        super(throwable);
    }

    public DataRecordException(final String s, final Throwable throwable, final boolean b, final boolean b1) {
        super(s, throwable, b, b1);
    }
}
