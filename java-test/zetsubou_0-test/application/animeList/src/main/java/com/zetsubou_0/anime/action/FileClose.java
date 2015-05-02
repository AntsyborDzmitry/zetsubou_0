package com.zetsubou_0.anime.action;

import com.zetsubou_0.anime.constant.ActionConstant;
import com.zetsubou_0.anime.exception.ActionException;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by zetsubou_0 on 02.05.15.
 */
public class FileClose implements Action {
    private Action action;
    private Map<String, Object> params = new HashMap<>();

    public FileClose() {
    }

    public FileClose(Action action) throws ActionException {
        this.action = action;
        params.putAll(action.getParams());
    }

    @Override
    public Map<String, Object> getParams() throws ActionException {
        return params;
    }

    @Override
    public void setParams(Map<String, Object> params) throws ActionException {
        this.params= params;
    }

    @Override
    public void addParams(Map<String, Object> params) throws ActionException {
        this.params.putAll(params);
    }

    @Override
    public void perform() throws ActionException {
        RandomAccessFile file = (RandomAccessFile) params.get(ActionConstant.File.FILE_REF);
        if(file != null) {
            try {
                file.close();
            } catch (IOException e) {
                throw new ActionException(e);
            }
        }
    }
}