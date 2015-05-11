package com.zetsubou_0.animelist.anime.action;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.zetsubou_0.animelist.anime.bean.Anime;
import com.zetsubou_0.animelist.anime.bean.Series;
import com.zetsubou_0.animelist.anime.constant.ActionConstant;
import com.zetsubou_0.animelist.anime.constant.FileSystemConstant;
import com.zetsubou_0.animelist.anime.exception.ActionException;

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
        Map<String, Object> source = (Map<String, Object>) params.get(ActionConstant.Source.FILE);
        String path = (String) source.get(ActionConstant.Source.RESOURCE_PATH);
        Series<Anime> seriesSet = (Series<Anime>) params.get(ActionConstant.Anilist.ANIME_SERIES);
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
                Map<String, Object> streamParams = new HashMap<>();
                streamParams.put(ActionConstant.Source.RESOURCE, file);
                fileParams.put(ActionConstant.Source.STREAM, streamParams);
                file.write(gson.toJson(seriesSet).getBytes());
                addParams(fileParams);
            } catch (IOException e) {
                throw new ActionException(e);
            }
        }
    }
}
