package com.zetsubou_0.animelist.anime.action;

import com.zetsubou_0.animelist.anime.constant.FileSystemConstant;
import com.zetsubou_0.animelist.anime.exception.ActionException;
import org.apache.commons.lang3.StringUtils;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.Map;

/**
 * Created by zetsubou_0 on 24.05.15.
 */
public class WriteFile extends AbstractAction {
    private static RandomAccessFile file;
    private static RandomAccessFile errorFile;

    private static Object fileSync = new Object();
    private static Object errorFileSync = new Object();

    protected Class syncObject = WriteFile.class;
    protected String path = "";
    protected String data = "";
    protected String dataError = "";

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
        if(StringUtils.isBlank(path)) {
            path = (String) ((Map<String, Object>) params.get(SourceContainer.FILE)).get(SourceContainer.RESOURCE_IN);
        }
        if(StringUtils.isBlank(data)) {
            data = (String) ((Map<String, Object>)params.get(SourceContainer.PLAIN_TEXT)).get(SourceContainer.DATA);
            if(StringUtils.isBlank(data)) {
                data = "";
            }
        }
        if(StringUtils.isBlank(dataError)) {
            dataError = (String) ((Map<String, Object>)params.get(SourceContainer.PLAIN_TEXT)).get(SourceContainer.DATA_ERROR);
            if(StringUtils.isBlank(dataError)) {
                dataError = "";
            }
        }

        synchronized(fileSync) {
            if(file == null) {
                try {
                    // get stream from params
                    file = (RandomAccessFile) params.get(SourceContainer.STREAM);
                    if(file == null) {
                        // create new file with path from params
                        file = new RandomAccessFile(path + FileSystemConstant.JSON, FileSystemConstant.READ_WRITE);
                    }
                } catch (FileNotFoundException e) {
                    throw new ActionException(e);
                }
            }

            try {
                file.write(dataError.getBytes());
            } catch (IOException e) {
                throw new ActionException(e);
            }
        }

        synchronized(errorFileSync) {
            if(errorFile == null) {
                try {
                    errorFile = new RandomAccessFile(path + FileSystemConstant.ERROR + FileSystemConstant.JSON, FileSystemConstant.READ_WRITE);
                } catch (FileNotFoundException e) {
                    throw new ActionException(e);
                }
            }

            try {
                errorFile.write(data.getBytes());
            } catch (IOException e) {
                throw new ActionException(e);
            }
        }
    }

}
