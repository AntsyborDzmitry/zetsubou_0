package com.zetsubou_0.proxy.api;

import com.zetsubou_0.proxy.api.exception.FileReaderException;

import java.io.FileInputStream;
import java.io.Serializable;

/**
 * Created by Kiryl_Lutsyk on 10/29/2015.
 */
public interface FileReader<T extends Serializable> extends PersonInfo {
    static final String PATH = "d:\\temp\\00\\person.obj";

    FileInputStream open(String path) throws FileReaderException;
    void close() throws FileReaderException;
    T read();
}
