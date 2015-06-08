package com.zetsubou_0.animelist.anime.action;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.zetsubou_0.animelist.anime.exception.ActionException;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by zetsubou_0 on 25.05.15.
 */
public class JsonWrapper extends AbstractAction {
    public JsonWrapper() {
    }

    public JsonWrapper(Action action) throws ActionException {
        super(action);
    }

    @Override
    public void perform() throws ActionException {
        Gson gson = new GsonBuilder().setPrettyPrinting().create();

        Map<String, Object> json = new HashMap<>();

        String data = gson.toJson(params.get(SourceContainer.DATA));
        json.put(SourceContainer.DATA, data);
        data = gson.toJson(params.get(SourceContainer.DATA_ERROR));
        json.put(SourceContainer.DATA_ERROR, data);

        params.put(SourceContainer.JSON, json);
    }
}
