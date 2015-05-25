package com.zetsubou_0.animelist.anime.job.util;

import com.zetsubou_0.animelist.anime.exception.ActionException;
import com.zetsubou_0.animelist.anime.job.Job;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zetsubou_0 on 22.05.15.
 */
public class JobLinkerImpl implements JobLinker {
    private Job from;
    private List<Job> to = new ArrayList<>();
    private boolean isGenerator = false;
    private Map<String, Object> additionalParams = new HashMap<>();
    private List<String> keyCain = new ArrayList<>();
    private Class generatedJob;
    private boolean isStart = false;

    @Override
    public void chain(final Job from, final Job to) {
        chain(from, to, false);
    }

    @Override
    public void chain(final Job from, final Job to, boolean isStart) {
        chain(from, new ArrayList<Job>() {{add(to);}}, isStart);
    }

    @Override
    public void chain(final Job from, final  List<Job> to) {
        chain(from, to, false);
    }

    @Override
    public void chain(Job from, List<Job> to, boolean isStart) {
        isGenerator = false;
        this.from = from;
        this.to = to;
        this.isStart = isStart;

        // add this as listener
        from.addlistener(this);

        new Thread(from).start();
    }

    @Override
    public List<Job> chainFromGenerator(Job from, Class job, List<String> keyCain) throws IllegalAccessException, ActionException, InstantiationException, InterruptedException {
        return chainFromGenerator(from, job, keyCain, false);
    }

    @Override
    public List<Job> chainFromGenerator(Job from, Class job, List<String> keyCain, Map<String, Object> additionalParams) throws IllegalAccessException, ActionException, InstantiationException, InterruptedException {
        return chainFromGenerator(from,job,keyCain,additionalParams, false);
    }

    @Override
    public List<Job> chainFromGenerator(Job from, Class job, List<String> keyCain, boolean isStart) throws IllegalAccessException, ActionException, InstantiationException, InterruptedException {
        return chainFromGenerator(from,job,keyCain, new HashMap<String, Object>(), isStart);
    }

    @Override
    public List<Job> chainFromGenerator(Job from, Class job, List<String> keyCain, Map<String, Object> additionalParams, boolean isStart) throws IllegalAccessException, ActionException, InstantiationException, InterruptedException {
        isGenerator = true;
        this.from = from;
        this.generatedJob = job;
        this.keyCain = keyCain;
        this.isStart = isStart;
        if(additionalParams != null) {
            this.additionalParams = additionalParams;
        } else {
            this.additionalParams = new HashMap<>();
        }

        synchronized (JobLinkerImpl.class) {
            // add this as listener
            from.addlistener(this);

            new Thread(from).start();
            JobLinkerImpl.class.wait();
        }

        return to;
    }

    /**
     * Get results from job 'from' to job 'to'
     * when 'to' finished work
     */
    @Override
    public void performAction() {
        if(isGenerator) {
            JobFactory jobFactory = new JobFactoryImpl();
            try {
                to = jobFactory.generate(generatedJob, from, keyCain, additionalParams);
            } catch (IllegalAccessException | InstantiationException | ActionException e) {
                e.printStackTrace();
            }
        }

        for (Job job : to) {
            job.setAction(from.getAction());
        }

        synchronized (JobLinkerImpl.class) {
            JobLinkerImpl.class.notifyAll();
        }

        if(isStart) {
            for (Job job : to) {
                new Thread(job).start();
            }
        }
    }
}
