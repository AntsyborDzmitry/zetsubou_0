package com.zetsubou_0.animelist.anime.job;

import com.zetsubou_0.animelist.anime.action.Action;
import com.zetsubou_0.animelist.anime.action.ReadAnimeDirectory;
import com.zetsubou_0.animelist.anime.exception.ActionException;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by zetsubou_0 on 22.05.15.
 */
public class ReadFileSystemJob extends AbstractJob {
    private String path;

    public ReadFileSystemJob() {
        super();
    }

    public ReadFileSystemJob(String path) {
        this.path = path;
    }

    @Override
    public void actionInit() throws ActionException {
        if(getAction() == null) {
            action = new ReadAnimeDirectory();
        } else {
            action = new ReadAnimeDirectory(action);
        }

        Map<String, Object> source = new HashMap<>();
        source.put(Action.SourceContainer.RESOURCE_OUT, path);

        Map<String, Object> params = action.getParams();
        params.put(Action.SourceContainer.DIRECTORY, source);
        action.addParams(params);
    }
}
