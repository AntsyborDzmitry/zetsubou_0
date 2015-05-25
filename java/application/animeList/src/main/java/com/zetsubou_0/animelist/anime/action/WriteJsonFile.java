package com.zetsubou_0.animelist.anime.action;

import com.zetsubou_0.animelist.anime.exception.ActionException;

import java.io.*;
import java.util.Map;

/**
 * Created by zetsubou_0 on 01.05.15.
 */
public class WriteJsonFile extends WriteFile {
    public WriteJsonFile() {
        super();
        data = (String) ((Map<String, Object>)params.get(SourceContainer.JSON)).get(SourceContainer.DATA);
        dataError = (String) ((Map<String, Object>)params.get(SourceContainer.JSON)).get(SourceContainer.DATA_ERROR);
    }

    public WriteJsonFile(String path) {
        super();
        this.path = path;
        data = (String) ((Map<String, Object>)params.get(SourceContainer.JSON)).get(SourceContainer.DATA);
        dataError = (String) ((Map<String, Object>)params.get(SourceContainer.JSON)).get(SourceContainer.DATA_ERROR);
    }

    public WriteJsonFile(Action action) throws ActionException {
        super(action);
        data = (String) ((Map<String, Object>)params.get(SourceContainer.JSON)).get(SourceContainer.DATA);
        dataError = (String) ((Map<String, Object>)params.get(SourceContainer.JSON)).get(SourceContainer.DATA_ERROR);
    }
}