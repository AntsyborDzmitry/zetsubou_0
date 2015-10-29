package com.zetsubou_0.proxy;

import com.zetsubou_0.proxy.api.FileReader;
import com.zetsubou_0.proxy.api.exception.FileReaderException;

import java.io.*;

/**
 * Created by Kiryl_Lutsyk on 10/29/2015.
 */
public class FileReaderImpl<T extends Serializable> implements FileReader<T> {
    private FileInputStream in;

    @Override
    public FileInputStream open(String path) throws FileReaderException {
        if(in != null) {
            close();
        }

        try {
            in = new FileInputStream(new File(path));
        } catch (FileNotFoundException e) {
            throw new FileReaderException(e);
        }
        return in;
    }

    @Override
    public T read() {
        T obj = null;
        if(in != null) {
            try {
                ObjectInputStream objectStream = new ObjectInputStream(in);
                obj = (T) objectStream.readObject();
            } catch (IOException | ClassNotFoundException e) {}
        }
        return obj;
    }

    @Override
    public void close() throws FileReaderException {
        try {
            in.close();
        } catch (IOException e) {
            throw new FileReaderException(e);
        }
    }

    @Override
    public String getInfo() {
        return "unknown";
    }
}
