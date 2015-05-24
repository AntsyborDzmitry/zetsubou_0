package com.zetsubou_0.animelist.anime.action;

import com.zetsubou_0.animelist.anime.constant.FileSystemConstant;
import com.zetsubou_0.animelist.anime.exception.ActionException;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.Map;

/**
 * Created by zetsubou_0 on 24.05.15.
 */
public class WriteFile extends AbstractAction {
    private static RandomAccessFile file;

    protected Class syncObject = WriteFile.class;
    protected String path = (String) ((Map<String, Object>) params.get(SourceContainer.FILE)).get(SourceContainer.RESOURCE_IN);
    protected String data = (String) params.get(SourceContainer.PLAIN_TEXT);

    public WriteFile() {
        super();
        syncObject = this.getClass();
    }

    public WriteFile(Action action) throws ActionException {
        super(action);
        syncObject = this.getClass();
    }

    @Override
    public void perform() throws ActionException {
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
                file.write(data.getBytes());
            } catch (IOException e) {
                throw new ActionException(e);
            }
        }
    }

}
