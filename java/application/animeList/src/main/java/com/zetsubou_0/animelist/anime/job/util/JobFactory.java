package com.zetsubou_0.animelist.anime.job.util;

import com.zetsubou_0.animelist.anime.action.Action;
import com.zetsubou_0.animelist.anime.exception.ActionException;
import com.zetsubou_0.animelist.anime.job.Job;

import java.util.List;
import java.util.Map;

/**
 * Created by zetsubou_0 on 22.05.15.
 */
public interface JobFactory {
    void isGeneratedStart(boolean isStarted);

    List<Job> generate(Class jobClass, Action action, int count) throws IllegalAccessException, InstantiationException, ActionException;
    List<Job> generate(Class jobClass, Action action, int count, Map<String, Object> additionalParams) throws IllegalAccessException, InstantiationException, ActionException;

    List<Job> generate(Class jobClass, List<Action> actions) throws IllegalAccessException, InstantiationException, ActionException;
    List<Job> generate(Class jobClass, List<Action> actions, Map<String, Object> additionalParams) throws IllegalAccessException, InstantiationException, ActionException;

    List<Job> generate(Class jobClass, Job job, List<String> countKey) throws IllegalAccessException, InstantiationException, ActionException;
    List<Job> generate(Class jobClass, Job job, List<String> countKey, Map<String, Object> additionalParams) throws IllegalAccessException, InstantiationException, ActionException;
}
