package com.zetsubou_0.anime.action;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.zetsubou_0.anime.bean.Anime;
import com.zetsubou_0.anime.bean.Series;
import com.zetsubou_0.anime.constant.ActionConstant;
import com.zetsubou_0.anime.constant.FileSystemConstant;
import com.zetsubou_0.anime.exception.ActionException;

import java.io.*;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by zetsubou_0 on 01.05.15.
 */
public class WriteJsonFile implements Action {
    private Action action;
    private Map<String, Object> params = new HashMap<>();
    private static RandomAccessFile file;

    public WriteJsonFile() {
    }

    public WriteJsonFile(Action action) throws ActionException {
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
        String path = (String) params.get(ActionConstant.File.PATH_TO);
        Series<Anime> series = (Series<Anime>) params.get(ActionConstant.Anilist.ANIME_SERIES);
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        Map<String, Object> fileParams = new HashMap<>();

        synchronized(WriteJsonFile.class) {
            if(file == null) {
                try {
                    file = new RandomAccessFile(path, FileSystemConstant.READ_WRITE);
                } catch (FileNotFoundException e) {
                    throw new ActionException(e);
                }
            }

            try {
                file.write(gson.toJson(series).getBytes());
                fileParams.put(ActionConstant.File.FILE_REF, file);
                addParams(fileParams);
            } catch (IOException e) {
                throw new ActionException(e);
            }
        }
    }
}
