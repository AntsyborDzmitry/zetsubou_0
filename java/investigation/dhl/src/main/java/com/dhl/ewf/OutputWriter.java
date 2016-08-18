package com.dhl.ewf;

import org.apache.commons.lang3.StringUtils;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintStream;

public class OutputWriter extends PrintStream {

    public OutputWriter(final File file) throws FileNotFoundException {
        super(file);
    }

    @Override
    public void println() {
        println(StringUtils.EMPTY);
    }

    @Override
    public void println(final String text) {
        super.println(text);
        System.out.println(text);
    }
}
