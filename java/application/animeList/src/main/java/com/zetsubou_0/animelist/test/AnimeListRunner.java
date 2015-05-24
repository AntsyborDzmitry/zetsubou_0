package com.zetsubou_0.animelist.test;

import com.zetsubou_0.animelist.anime.action.*;
import com.zetsubou_0.animelist.anime.constant.FileSystemConstant;
import com.zetsubou_0.animelist.anime.exception.ActionException;
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

        System.out.println("Complete");
    }

    public void process() {
        try {
            JobLinker jobLinker = new JobLinkerImpl();

            // read from file system
            Job readFileSystemJob = new ReadFileSystemJob(FileSystemConstant.PATH);

            // read from anilist
            List<String> keyChain = new ArrayList<>();
            keyChain.add(Action.AnimeContainer.ANIME);
            keyChain.add(Action.AnimeContainer.ANIME_SET);
            List<Job> jobs = jobLinker.chainFromGenerator(readFileSystemJob, ReadAnilist.class, keyChain);

            // write file
            Job writeJsonFile = new WriteJsonFileJob(FileSystemConstant.RESULTS + FileSystemConstant.JSON);
            for (Job j : jobs) {
                jobLinker.chain(j, writeJsonFile);
            }

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
