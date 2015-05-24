package com.zetsubou_0.animelist.anime.job;

import com.zetsubou_0.animelist.anime.action.Action;
import com.zetsubou_0.animelist.anime.exception.ActionException;
import com.zetsubou_0.animelist.anime.observer.Listener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by zetsubou_0 on 22.05.15.
 */
public abstract class AbstractJob implements Job, JobInitialization {
    protected Logger LOG = LoggerFactory.getLogger(Job.class);
    protected static Class syncObject = Job.class;
    protected List<Listener> listeners = new ArrayList<>();
    protected Action action;

    public AbstractJob() {
        syncObject = this.getClass();
    }

    @Override
    public void setAction(Action action) {
        synchronized (syncObject) {
            this.action = action;
        }
    }

    @Override
    public Action getAction() {
        synchronized (syncObject) {
            return action;
        }
    }

    @Override
    public void addlistener(Listener listener) {
        listeners.add(listener);
    }

    @Override
    public void removeListener(Listener listener) {
        listeners.add(listener);
    }

    @Override
    public void run() {
        try {
            actionInit();
            action.perform();
            notifyAllListeners();
        } catch (ActionException e) {
            LOG.error(e.getMessage(), e);
        }
    }

    protected void notifyAllListeners() {
        for(Listener listener : listeners) {
            listener.performAction();
        }
    }
}
