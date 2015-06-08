package com.zetsubou_0.animelist.test;

import com.zetsubou_0.animelist.anime.action.*;
import com.zetsubou_0.animelist.anime.constant.FileSystemConstant;
import com.zetsubou_0.animelist.anime.exception.ActionException;
import com.zetsubou_0.animelist.anime.helper.ActionHelper;
import com.zetsubou_0.animelist.anime.job.*;
import com.zetsubou_0.animelist.anime.job.util.JobLinker;
import com.zetsubou_0.animelist.anime.job.util.JobLinkerImpl;
import com.zetsubou_0.animelist.anime.observer.Listener;

import java.util.*;

/**
 * Created by zetsubou_0 on 01.05.15.
 */
public class AnimeListRunner implements Listener {
    private Job job;

    public static void main(String[] args) {
        new AnimeListRunner().process();
//        new AnimeListRunner().test();

        System.out.println("Complete");
    }

    public void test() {
    }

    public void process() {
        try {
            JobLinker jobLinker = new JobLinkerImpl();
            List<String> animeKeyChain = new ArrayList<>();
            animeKeyChain.add(Action.AnimeContainer.ANIME);
            animeKeyChain.add(Action.AnimeContainer.ANIME_SET);
            List<String> animeErrorKeyChain = new ArrayList<>();
            animeErrorKeyChain.add(Action.AnimeContainer.ANIME);
            animeErrorKeyChain.add(Action.AnimeContainer.ANIME_SET_ERROR);
            List<String> dataKeyChain = new ArrayList<>();
            dataKeyChain.add(Action.SourceContainer.DATA);
            List<String> dataErrorKeyChain = new ArrayList<>();
            dataErrorKeyChain.add(Action.SourceContainer.DATA_ERROR);
            List<String> queryKeyChain = new ArrayList<>();
            queryKeyChain.add(Action.SourceContainer.QUERY);

            // create read file system job
            Job readFileSystemJob = new ReadFileSystemJob(FileSystemConstant.PATH);

            // read from file system & create read from anilist
            List<Job> jobs = jobLinker.chainFromGenerator(readFileSystemJob, AnimeAnilistJob.class, animeKeyChain);

            // read from anilist, create json & create write file job
            Job writeJsonFileJob = new WriteJsonFileJob(FileSystemConstant.RESULTS);
            for (Job j : jobs) {
                Job jsonWrapperJob = new JsonWrapperJob();
                ActionHelper.transformAnimeStringParams(animeKeyChain, queryKeyChain, j.getAction().getParams());
                jobLinker.chain(j, jsonWrapperJob);
                jobLinker.chain(jsonWrapperJob, writeJsonFileJob);
            }

            // create notifier job
            List<Listener> listeners = new ArrayList<>();
            listeners.add(this);
            Job notifierJob = new NotifierJob(listeners);
            // write file job and notify this class
            jobLinker.chain(writeJsonFileJob, notifierJob, true);

        } catch (IllegalAccessException | InstantiationException | ActionException | InterruptedException e) {
            e.printStackTrace();
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
