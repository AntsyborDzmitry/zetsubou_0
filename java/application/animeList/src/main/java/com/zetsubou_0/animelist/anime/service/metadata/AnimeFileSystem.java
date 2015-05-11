package com.zetsubou_0.animelist.anime.service.metadata;

import com.zetsubou_0.animelist.anime.action.Action;
import com.zetsubou_0.animelist.anime.constant.ActionConstant;
import com.zetsubou_0.animelist.anime.constant.FileSystemConstant;
import com.zetsubou_0.animelist.anime.exception.ActionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by zetsubou_0 on 01.05.15.
 */
public class AnimeFileSystem implements AnimeData {
    private static final Logger LOG = LoggerFactory.getLogger(AnimeFileSystem.class);

    @Override
    public void pullData(Action action) {
        Map<String, Object> params = new HashMap<>();
        Map<String, Object> source = new HashMap<>();
        source.put(ActionConstant.Source.RESOURCE_PATH, FileSystemConstant.PATH);
        params.put(ActionConstant.Source.DIRECTORY, source);

        try {
            action.setParams(params);
            action.perform();
        } catch (ActionException e) {
            LOG.error(e.getMessage(), e);
        }
    }

}
