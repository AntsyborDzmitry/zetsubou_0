package com.zetsubou_0.animelist.anime.job.util;

import com.zetsubou_0.animelist.anime.action.Action;
import com.zetsubou_0.animelist.anime.exception.ActionException;
import com.zetsubou_0.animelist.anime.helper.ChainUtil;
import com.zetsubou_0.animelist.anime.job.Job;

import java.util.*;

/**
 * Created by zetsubou_0 on 22.05.15.
 */
public class JobFactoryImpl implements JobFactory {
    private List<Action> actions = new ArrayList<>();
    private boolean isStarted = false;

    @Override
    public void isGeneratedStart(boolean isStarted) {
        this.isStarted = isStarted;
    }

    @Override
    public List<Job> generate(Class jobClass, Action action, int count) throws IllegalAccessException, InstantiationException, ActionException {
        return generate(jobClass, action, count, new HashMap<String, Object>());
    }

    @Override
    public List<Job> generate(Class jobClass, Action action, int count, Map<String, Object> additionalParams) throws IllegalAccessException, InstantiationException, ActionException {
        List<Action> actionList = new ArrayList<>(count);
        for (int i = 0; i < count; i++) {
            actionList.add(action);
        }
        return generate(jobClass, actionList, additionalParams);
    }

    @Override
    public List<Job> generate(Class jobClass, List<Action> actions) throws IllegalAccessException, InstantiationException, ActionException {
        return generate(jobClass, actions, new HashMap<String, Object>());
    }

    @Override
    public List<Job> generate(Class jobClass, List<Action> actions, Map<String, Object> additionalParams) throws IllegalAccessException, InstantiationException, ActionException {
        List<Job> jobs = new ArrayList<>(actions.size());

        for (Action action : actions) {
            // create job instance
            Job job = (Job) jobClass.newInstance();

            // add additional params
            action.getParams().putAll(additionalParams);

            job.setAction(action);
            jobs.add(job);
            if(isStarted) {
                new Thread(job).start();
            }
        }

        return jobs;
    }

    @Override
    public List<Job> generate(Class jobClass, Job job, List<String> countKey) throws IllegalAccessException, InstantiationException, ActionException {
        return generate(jobClass, job, countKey, new HashMap<String, Object>());
    }

    @Override
    public List<Job> generate(Class jobClass, Job job, List<String> countKey, Map<String, Object> additionalParams) throws IllegalAccessException, InstantiationException, ActionException {
        Action action = job.getAction();
        Map<String, Object> params = action.getParams();

        Object key = ChainUtil.getInnerParam(countKey, params);
        int count = 0;
        if(key instanceof String) {
            count = Integer.parseInt((String) key);
        } else if(key instanceof Collection) {
            count = ((Collection)key).size();
        } else if(key instanceof Map) {
            count = ((Map) key).size();
        }

        return generate(jobClass, action, count, additionalParams);
    }
}
