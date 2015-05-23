package com.zetsubou_0.animelist.anime.job;

import com.zetsubou_0.animelist.anime.action.Action;
import com.zetsubou_0.animelist.anime.action.ReadAnilist;
import com.zetsubou_0.animelist.anime.exception.ActionException;
import com.zetsubou_0.animelist.anime.observer.Listener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by zetsubou_0 on 01.05.15.
 */
public class AnimeAnilistJob extends AbstractJob {
    private static final Logger LOG = LoggerFactory.getLogger(AnimeAnilistJob.class);

    public AnimeAnilistJob() {
        super();
    }

    public AnimeAnilistJob(final Action action) {
        this.action = action;
    }

    @Override
    public void addlistener(Listener listener) {
        listeners.add(listener);
    }

    @Override
    public void removeListener(Listener listener) {
        listeners.remove(listener);
    }

    @Override
    public void run() {
        if(getAction() == null) {
            action = new ReadAnilist();
        } else {
            try {
                action = new ReadAnilist(action);
            } catch (ActionException e) {
                LOG.error(e.getMessage(), e);
            }
        }
    }

}
