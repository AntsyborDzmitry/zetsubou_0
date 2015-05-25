package com.zetsubou_0.animelist.anime.action;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.zetsubou_0.animelist.anime.exception.ActionException;

import java.util.Map;

/**
 * Created by zetsubou_0 on 25.05.15.
 */
public class JsonWrapper extends AbstractAction {
    @Override
    public void perform() throws ActionException {
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
//        Map<>
//        data = (String) ((Map<String, Object>)params.get(SourceContainer.JSON)).get(SourceContainer.DATA);
//        dataError = (String) ((Map<String, Object>)params.get(SourceContainer.JSON)).get(SourceContainer.DATA_ERROR);

    }
}
