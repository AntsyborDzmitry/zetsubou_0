package com.zetsubou_0.animelist.anime.job;

import com.zetsubou_0.animelist.anime.action.EmptyAction;
import com.zetsubou_0.animelist.anime.exception.ActionException;
import com.zetsubou_0.animelist.anime.observer.Listener;

import java.util.List;

/**
 * Created by zetsubou_0 on 25.05.15.
 */
public class NotifierJob extends AbstractJob {
    public NotifierJob() {
    }

    public NotifierJob(List<Listener> listeners) {
        this.listeners = listeners;
    }

    @Override
    public void actionInit() throws ActionException {
        action = new EmptyAction();
    }
}
