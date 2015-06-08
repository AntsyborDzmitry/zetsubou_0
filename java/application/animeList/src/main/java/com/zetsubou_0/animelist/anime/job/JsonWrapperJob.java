package com.zetsubou_0.animelist.anime.job;

import com.zetsubou_0.animelist.anime.action.JsonWrapper;
import com.zetsubou_0.animelist.anime.exception.ActionException;

/**
 * Created by zetsubou_0 on 25.05.15.
 */
public class JsonWrapperJob extends AbstractJob {
    @Override
    public void actionInit() throws ActionException {
        if (getAction() == null) {
            action = new JsonWrapper();
        } else {
            action = new JsonWrapper(action);
        }
    }
}
