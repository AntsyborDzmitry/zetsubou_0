package com.zetsubou_0.animelist.anime.job;

import com.zetsubou_0.animelist.anime.action.Action;
import com.zetsubou_0.animelist.anime.action.ReadAnilist;
import com.zetsubou_0.animelist.anime.exception.ActionException;

/**
 * Created by zetsubou_0 on 01.05.15.
 */
public class AnimeAnilistJob extends AbstractJob {
    public AnimeAnilistJob() {
        super();
    }

    public AnimeAnilistJob(final Action action) {
        this.action = action;
    }

    @Override
    public void actionInit() throws ActionException {
        // todo implement method
        if(getAction() == null) {
            action = new ReadAnilist();
        } else {
            action = new ReadAnilist(action);
        }
    }
}
