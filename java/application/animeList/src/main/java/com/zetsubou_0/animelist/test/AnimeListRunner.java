package com.zetsubou_0.animelist.test;

import com.zetsubou_0.animelist.anime.action.Action;
import com.zetsubou_0.animelist.anime.action.JcrRead;
import com.zetsubou_0.animelist.anime.action.ReadAnimeDirectory;
import com.zetsubou_0.animelist.anime.action.WriteJsonFile;
import com.zetsubou_0.animelist.anime.bean.Anime;
import com.zetsubou_0.animelist.anime.constant.FileSystemConstant;
import com.zetsubou_0.animelist.anime.exception.ActionException;
import com.zetsubou_0.animelist.anime.job.Job;
import com.zetsubou_0.animelist.anime.job.ReadFileSystemJob;
import com.zetsubou_0.animelist.anime.job.util.JobFactory;
import com.zetsubou_0.animelist.anime.job.util.JobFactoryImpl;
import com.zetsubou_0.animelist.anime.job.util.JobLinker;
import com.zetsubou_0.animelist.anime.job.util.JobLinkerImpl;
import com.zetsubou_0.animelist.anime.observer.Listener;
import com.zetsubou_0.animelist.anime.service.metadata.AnimeAnilist;
import com.zetsubou_0.animelist.anime.service.metadata.AnimeData;
import com.zetsubou_0.animelist.anime.service.metadata.AnimeFileSystem;

import java.util.*;
import java.util.concurrent.TimeUnit;

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
            Job readFileSystemJob = new ReadFileSystemJob(FileSystemConstant.PATH);

            List<Job> jobs = jobLinker.chainFromGenerator(readFileSystemJob, ReadFileSystemJob.class, new ArrayList<String>() {{
                add(Action.AnimeContainer.ANIME);
                add(Action.AnimeContainer.ANIME_SET);
            }});

            int i = 0;
            for (Job j : jobs) {
                System.out.println("" + ++i + " - " + j);
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
