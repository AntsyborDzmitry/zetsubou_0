package com.zetsubou_0.animelist.anime.action;

import com.zetsubou_0.animelist.anime.constant.FileSystemConstant;
import com.zetsubou_0.animelist.anime.exception.ActionException;

import java.io.*;
import java.util.Map;

/**
 * Created by zetsubou_0 on 01.05.15.
 */
public class WriteJsonFile extends AbstractAction {
    private static RandomAccessFile file;

    public WriteJsonFile() {
    }

    public WriteJsonFile(Action action) throws ActionException {
        super(action);
    }

    @Override
    public void perform() throws ActionException {
        Map<String, Object> source = (Map<String, Object>) params.get(SourceContainer.FILE);
        String path = (String) source.get(SourceContainer.RESOURCE_IN);
        String json = (String) params.get(SourceContainer.JSON);

        synchronized(WriteJsonFile.class) {
            if(file == null) {
                try {
                    // get stream from params
                    file = (RandomAccessFile) params.get(SourceContainer.STREAM);
                    if(file == null) {
                        // create new file with path from params
                        file = new RandomAccessFile(path, FileSystemConstant.READ_WRITE);
                    }
                } catch (FileNotFoundException e) {
                    throw new ActionException(e);
                }
            }

            try {
                file.write(json.getBytes());
            } catch (IOException e) {
                throw new ActionException(e);
            }
        }
    }
}
