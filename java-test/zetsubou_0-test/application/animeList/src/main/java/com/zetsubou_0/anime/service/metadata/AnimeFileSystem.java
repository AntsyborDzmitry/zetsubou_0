package com.zetsubou_0.anime.service.metadata;

import com.zetsubou_0.anime.action.Action;
import com.zetsubou_0.anime.constant.ActionConstant;
import com.zetsubou_0.anime.constant.FileSystemConstant;
import com.zetsubou_0.anime.exception.ActionException;
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
        params.put(ActionConstant.File.ROOT_PATH, FileSystemConstant.PATH);

        try {
            action.setParams(params);
            action.perform();
        } catch (ActionException e) {
            LOG.error(e.getMessage(), e);
        }
    }

}
