package com.zetsubou_0.animelist.anime.action;

import com.zetsubou_0.animelist.anime.exception.ActionException;

import java.io.*;

/**
 * Created by zetsubou_0 on 01.05.15.
 */
public class WriteJsonFile extends WriteFile {
    private static RandomAccessFile file;

    public WriteJsonFile() {
        super();
        data = (String) params.get(SourceContainer.JSON);
    }

    public WriteJsonFile(Action action) throws ActionException {
        super(action);
        data = (String) params.get(SourceContainer.JSON);
    }
}