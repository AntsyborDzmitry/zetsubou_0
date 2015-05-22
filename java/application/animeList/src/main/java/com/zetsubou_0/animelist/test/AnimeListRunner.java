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
import com.zetsubou_0.animelist.anime.observer.Listener;
import com.zetsubou_0.animelist.anime.service.metadata.AnimeAnilist;
import com.zetsubou_0.animelist.anime.service.metadata.AnimeData;
import com.zetsubou_0.animelist.anime.service.metadata.AnimeFileSystem;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
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
        job = new ReadFileSystemJob(FileSystemConstant.PATH);
        job.addlistener(this);
        new Thread(job).start();
    }

    @Override
    public void performAction() {
        synchronized(AnimeListRunner.class) {
            AnimeListRunner.class.notifyAll();
            System.out.println("All process was finished successfully");

            try {
                Map<String, Map<String, Set<Anime>>> res = (Map<String, Map<String, Set<Anime>>>) job.getAction().getParams().get(Action.AnimeContainer.ANIME);
                System.out.println("Anime set");
                System.out.println(res.get(Action.AnimeContainer.ANIME_SET));
                System.out.println("Anime set error");
                System.out.println(res.get(Action.AnimeContainer.ANIME_SET_ERROR));
            } catch (ActionException e) {
                e.printStackTrace();
            }
        }
    }
}
