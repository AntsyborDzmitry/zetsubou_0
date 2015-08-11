package com.zetsubou_0.animelist.anime.controller;

import com.zetsubou_0.animelist.anime.bean.Anime;
import com.zetsubou_0.animelist.anime.constant.FileSystemConstant;
import com.zetsubou_0.animelist.anime.exception.JobException;
import com.zetsubou_0.animelist.anime.job.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * Created by zetsubou_0 on 19.07.15.
 */
public class Controller implements Runnable {
    private static final Logger LOG = LoggerFactory.getLogger(Controller.class);

    @Override
    public void run() {
        try {
            writeJcr();
        } catch (Exception e) {
            LOG.error(e.getMessage(), e);
        }
    }

    protected void writeJcr() {
        Job writeJcrJob = new WriteJcrJob();
        writeJcrJob.performAction();
    }

    protected void readFsAnilistSync() throws JobException, InterruptedException {
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

        // create anilist jobs
        for(String key : animeSeries.keySet()) {
            // read from anilist.co job
            Job anilistJob = new AnimeAnilistJob();
            params = new HashMap<>();
            Map<String, Set<Anime>> anime = new HashMap<>();
            anime.put(key, animeSeries.get(key));
            params.put(Job.AnimeContainer.ANIME, anime);
            params.put(Job.JobContainer.JOB_LIST, jobs);
            anilistJob.initParams(params);
            jobs.add(anilistJob);
        }

        // write job is created
        Job fileWriterJob = new WriteJsonFileJob();
        params = new HashMap<>();
        params.put(Job.SourceContainer.RESOURCE_IN, FileSystemConstant.RESULTS);
        fileWriterJob.initParams(params);

        // create file close job
        Job fileCloseJob = new FileCloseJob();
        params = new HashMap<>();
        params.put(Job.JobContainer.JOB_LIST, jobs);
        fileCloseJob.initParams(params);
        fileWriterJob.chain(fileCloseJob);

        // start all anilist jobs
        for(Job anilistJob : jobs) {
            anilistJob.chain(fileWriterJob);
            anilistJob.performAction();
        }

        synchronized(jobs) {
            while(true) {
                TimeUnit.SECONDS.sleep(2);
                if(jobs.size() == 0) {
                    LOG.info("Synchronization was finished.");
                    break;
                }
            }
        }
    }
}
