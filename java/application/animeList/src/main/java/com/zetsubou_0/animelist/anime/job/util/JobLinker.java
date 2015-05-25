package com.zetsubou_0.animelist.anime.job.util;

import com.zetsubou_0.animelist.anime.exception.ActionException;
import com.zetsubou_0.animelist.anime.job.Job;
import com.zetsubou_0.animelist.anime.observer.Listener;

import java.util.List;
import java.util.Map;

/**
 * Created by zetsubou_0 on 22.05.15.
 */
public interface JobLinker extends Listener {
    void chain(Job from, Job to);
    void chain(Job from, Job to, boolean isStart);
    void chain(Job from, List<Job> to);
    void chain(Job from, List<Job> to, boolean isStart);

    List<Job> chainFromGenerator(Job from, Class job, List<String> keyCain) throws IllegalAccessException, ActionException, InstantiationException, InterruptedException;
    List<Job> chainFromGenerator(Job from, Class job, List<String> keyCain, Map<String, Object> additionalParams) throws IllegalAccessException, ActionException, InstantiationException, InterruptedException;
    List<Job> chainFromGenerator(Job from, Class job, List<String> keyCain, boolean isStart) throws IllegalAccessException, ActionException, InstantiationException, InterruptedException;
    List<Job> chainFromGenerator(Job from, Class job, List<String> keyCain, Map<String, Object> additionalParams, boolean isStart) throws IllegalAccessException, ActionException, InstantiationException, InterruptedException;
}