package com.zetsubou_0.animelist.anime.action;

import com.zetsubou_0.animelist.anime.exception.ActionException;

import java.io.Closeable;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by zetsubou_0 on 02.05.15.
 */
public class FileClose extends AbstractAction {

    public FileClose() {
    }

    public FileClose(Action action) throws ActionException {
        super(action);
    }

    @Override
    public void perform() throws ActionException {
        Map<String, Object> source = (Map<String, Object>) params.get(SourceContainer.STREAM);
        Closeable file = (Closeable) source.get(SourceContainer.RESOURCE);
        if(file != null) {
            try {
                file.close();
            } catch (IOException e) {
                throw new ActionException(e);
            }
        }
    }
}
