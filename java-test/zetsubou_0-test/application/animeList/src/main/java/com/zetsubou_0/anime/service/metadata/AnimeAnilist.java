package com.zetsubou_0.anime.service.metadata;

import com.zetsubou_0.anime.action.Action;
import com.zetsubou_0.anime.action.WriteJsonFile;
import com.zetsubou_0.anime.bean.Anime;
import com.zetsubou_0.anime.bean.Series;
import com.zetsubou_0.anime.constant.ActionConstant;
import com.zetsubou_0.anime.constant.FileSystemConstant;
import com.zetsubou_0.anime.exception.ActionException;
import com.zetsubou_0.anime.job.AnimeAnilistJob;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

/**
 * Created by zetsubou_0 on 26.04.15.
 */
public class AnimeAnilist implements AnimeData {
    private static final Logger LOG = LoggerFactory.getLogger(AnimeAnilist.class);

    @Override
    public void pullData(Action action) {
        try {
            Set<Series<Anime>> seriesSet = (Set<Series<Anime>>) action.getParams().get(ActionConstant.Anilist.ANIME_SERIES_SET);
            List<AnimeAnilistJob> jobs = new ArrayList<>();
            Map<String, Object> params = new HashMap<>();

            // remove series set
            params.putAll(action.getParams());
            params.remove(ActionConstant.Anilist.ANIME_SERIES_SET);

            params.put(ActionConstant.File.PATH_TO, FileSystemConstant.RESULTS + FileSystemConstant.JSON);
            params.put(ActionConstant.Anilist.JOB_LIST, jobs);
            action.addParams(params);

            for(Series<Anime> series : seriesSet) {
                params = new HashMap<>();
                // add title instead of series set
                params.put(ActionConstant.Anilist.TITLE, series.getId());
                Action act = new WriteJsonFile(action);
                act.addParams(params);

                AnimeAnilistJob job = new AnimeAnilistJob(act);
                jobs.add(job);

                // start threads
                new Thread(job).start();
            }
        } catch (ActionException e) {
            LOG.error(e.getMessage(), e);
        }



    }
}