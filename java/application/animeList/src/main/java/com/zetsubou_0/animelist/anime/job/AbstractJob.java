package com.zetsubou_0.animelist.anime.job;

import com.zetsubou_0.animelist.anime.exception.JobException;
import com.zetsubou_0.animelist.anime.observer.Listener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zetsubou_0 on 22.05.15.
 */
public abstract class AbstractJob implements Job {
    protected Logger LOG = LoggerFactory.getLogger(Job.class);
    protected static Class syncObject = Job.class;
    protected List<Listener> listeners = new ArrayList<>();
    protected Map<String, Object> params = new HashMap<>();
    protected Thread thread;

    public AbstractJob() {
        syncObject = this.getClass();
    }

    @Override
    public void addListener(Listener listener) {
        listeners.add(listener);
    }

    @Override
    public void removeListener(Listener listener) {
        listeners.add(listener);
    }

    @Override
    public void performAction() {
        thread = new Thread(this);
        thread.start();
    }

    @Override
    public void chain(Job job) throws JobException {
        chain(job, new HashMap<String, Object>());
    }

    @Override
    public void chain(List<Job> jobs) throws JobException {
        chain(jobs, new HashMap<String, Object>());
    }

    @Override
    public void chain(Job job, Map<String, Object> additionalParams) throws JobException {
        job.initParams(params);
        job.initParams(additionalParams);
        addListener(job);
    }

    @Override
    public void chain(List<Job> jobs, Map<String, Object> additionalParams) throws JobException {
        for(Job job : jobs) {
            chain(job, additionalParams);
        }
    }

    @Override
    public void initParams(Map<String, Object> params) {
        this.params.putAll(params);
    }

    @Override
    public void run() {
        try {
            action();
            notifyAllListeners();
        } catch (JobException e) {
            LOG.error(e.getMessage(), e);
        }
    }

    @Override
    public Thread getThread() {
        return thread;
    }

    @Override
    public Map<String, Object> getParams() {
        return params;
    }

    protected void notifyAllListeners() {
        for(Listener listener : listeners) {
            Job job = (Job)listener;
            job.initParams(params);
            job.performAction();
        }
    }
}
