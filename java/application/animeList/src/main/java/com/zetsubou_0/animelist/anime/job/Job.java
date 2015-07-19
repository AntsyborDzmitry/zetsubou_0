package com.zetsubou_0.animelist.anime.job;

import com.zetsubou_0.animelist.anime.exception.JobException;
import com.zetsubou_0.animelist.anime.observer.Handler;
import com.zetsubou_0.animelist.anime.observer.Listener;

import java.util.List;
import java.util.Map;

/**
 * Created by zetsubou_0 on 22.05.15.
 */
public interface Job extends Runnable, Handler, Listener {
    public class SourceContainer {
        public static final String FILE = "file";
        public static final String DIRECTORY = "directory";
        public static final String STREAM = "stream";
        public static final String PLAIN_TEXT = "plainText";
        public static final String JSON = "json";
        public static final String JCR = "jcr";
        public static final String QUERY = "query";

        public static final String RESOURCE = "resource";
        public static final String RESOURCE_OUT = "resourceOut";
        public static final String RESOURCE_IN = "resourceIn";

        public static final String DATA = "data";
        public static final String DATA_ERROR = "dataError";
    }

    public class AnimeContainer {
        public static final String TITLE = "title";
        public static final String ANIME = "anime";
        public static final String ANIME_SERIES = "animeSeries";
        public static final String ANIME_SET = "animeSet";
        public static final String ANIME_SET_ERROR = "animeSetError";
    }

    public class JobContainer {
        public static final String JOB_LIST = "jobList";
        public static final String JOB = "job";
    }

    public class Observer {
        public static final String LISTENER = "listener";
        public static final String HANDLER = "handler";
    }

    Thread getThread();
    Map<String, Object> getParams();
    void action() throws JobException;
    void initParams(Map<String, Object> params);
    void chain(Job job) throws JobException;
    void chain(List<Job> jobs) throws JobException;
    void chain(Job job, Map<String, Object> additionalParams) throws JobException;
    void chain(List<Job> jobs,Map<String, Object> additionalParams) throws JobException;
}
