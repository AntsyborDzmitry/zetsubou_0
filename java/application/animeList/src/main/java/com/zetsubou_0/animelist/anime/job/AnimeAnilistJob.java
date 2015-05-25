package com.zetsubou_0.animelist.anime.job;

import com.zetsubou_0.animelist.anime.action.Action;
import com.zetsubou_0.animelist.anime.action.ReadAnilist;
import com.zetsubou_0.animelist.anime.exception.ActionException;
import org.apache.commons.lang3.StringUtils;

/**
 * Created by zetsubou_0 on 01.05.15.
 */
public class AnimeAnilistJob extends AbstractJob {
    private String query;

    public AnimeAnilistJob() {
        super();
    }

    public AnimeAnilistJob(final Action action) {
        this.action = action;
    }

    public AnimeAnilistJob(String query) {
        this.query = query;
    }

    @Override
    public void actionInit() throws ActionException {
        if(getAction() == null) {
            action = new ReadAnilist();
        } else {
            action = new ReadAnilist(action);
        }

        if(StringUtils.isNotBlank(query)) {
            action.getParams().put(Action.SourceContainer.QUERY, query);
        }
    }
}
