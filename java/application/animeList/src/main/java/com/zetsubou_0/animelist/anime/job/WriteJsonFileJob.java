package com.zetsubou_0.animelist.anime.job;

import com.zetsubou_0.animelist.anime.action.Action;
import com.zetsubou_0.animelist.anime.action.WriteJsonFile;
import com.zetsubou_0.animelist.anime.exception.ActionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by zetsubou_0 on 24.05.15.
 */
public class WriteJsonFileJob extends AbstractJob {
    private Logger LOG = LoggerFactory.getLogger(WriteJsonFileJob.class);
    private String path = "";

    public WriteJsonFileJob() {
    }

    public WriteJsonFileJob(String path) {
        this.path = path;
    }

    @Override
    public void actionInit() throws ActionException {
        if (getAction() == null) {
            action = new WriteJsonFile();
        } else {
            action = new WriteJsonFile(action);
        }

        Map<String, Object> source = new HashMap<>();
        source.put(Action.SourceContainer.RESOURCE_IN, path);

        Map<String, Object> params = action.getParams();
        params.put(Action.SourceContainer.FILE, source);
        action.addParams(params);
    }
}
