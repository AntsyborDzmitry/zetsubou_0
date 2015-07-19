package com.zetsubou_0.animelist.test;

import com.zetsubou_0.animelist.anime.bean.Anime;
import com.zetsubou_0.animelist.anime.constant.FileSystemConstant;
import com.zetsubou_0.animelist.anime.exception.JobException;
import com.zetsubou_0.animelist.anime.job.*;
import com.zetsubou_0.animelist.anime.observer.Listener;

import java.util.*;

/**
 * Created by zetsubou_0 on 01.05.15.
 */
public class AnimeListRunner implements Listener {
    private Job job;

    public static void main(String[] args) {
        try {
            new AnimeListRunner().process();
        } catch (InterruptedException | JobException e) {
            e.printStackTrace();
        }
//        new AnimeListRunner().test();

        System.out.println("Complete");
    }

    public void test() {
    }

    public void process() throws InterruptedException, JobException {
        // read anime from disk
        Map<String, Object> params = new HashMap<>();
        params.put(Job.SourceContainer.RESOURCE_OUT, FileSystemConstant.PATH);
        Job readDisk = new ReadFileSystemJob();
        readDisk.initParams(params);
        readDisk.performAction();
        readDisk.getThread().join();

        // get read list
        Map<String, Set<Anime>> animeSeries = (Map<String, Set<Anime>>) readDisk.getParams().get(Job.AnimeContainer.ANIME_SERIES);
        List<Job> jobs = new ArrayList<>(animeSeries.size());

        // create file close job
        Job fileCloseJob = new FileCloseJob();
        params = new HashMap<>();
        params.put(Job.JobContainer.JOB_LIST, jobs);
        fileCloseJob.initParams(params);

        // write job is created
        Job fileWriterJob = new WriteJsonFileJob();
        params = new HashMap<>();
        params.put(Job.SourceContainer.RESOURCE_IN, FileSystemConstant.RESULTS);
        fileWriterJob.initParams(params);
        fileWriterJob.chain(fileCloseJob);

        for(String key : animeSeries.keySet()) {
            // read from anilist.co job
            Job anilistJob = new AnimeAnilistJob();
            params = new HashMap<>();
            Map<String, Set<Anime>> anime = new HashMap<>();
            anime.put(key, animeSeries.get(key));
            params.put(Job.AnimeContainer.ANIME, anime);
            params.put(Job.JobContainer.JOB_LIST, jobs);
            anilistJob.initParams(params);
            anilistJob.chain(fileWriterJob);
            jobs.add(anilistJob);
        }

        // start all anilist jobs
        for(Job anilistJob : jobs) {
            anilistJob.performAction();
        }
    }

    @Override
    public void performAction() {
        synchronized(AnimeListRunner.class) {
            AnimeListRunner.class.notifyAll();
            System.out.println("All process was finished successfully");
        }
    }
}
