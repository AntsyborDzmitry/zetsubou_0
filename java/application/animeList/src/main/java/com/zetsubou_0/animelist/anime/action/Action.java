package com.zetsubou_0.animelist.anime.action;

import com.zetsubou_0.animelist.anime.exception.ActionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

/**
 * Created by zetsubou_0 on 01.05.15.
 */
public interface Action {
    static final Logger LOG = LoggerFactory.getLogger(Action.class);

    public class SourceContainer {
        public static final String FILE = "file";
        public static final String DIRECTORY = "directory";
        public static final String STREAM = "stream";
        public static final String JSON = "json";
        public static final String JCR = "jcr";
        public static final String QUERY = "query";

        public static final String RESOURCE = "resource";
        public static final String RESOURCE_OUT = "resourceOut";
        public static final String RESOURCE_IN = "resourceIn";
    }

    public class AnimeContainer {
        public static final String TITLE = "title";
        public static final String ANIME = "anime";
        public static final String ANIME_SET = "animeSeries";
        public static final String ANIME_SET_ERROR = "animeSeriesError";
    }

    public class JobContainer {
        public static final String JOB_LIST = "jobList";
    }

    public class Observer {
        public static final String LISTENER = "listener";
        public static final String HANDLER = "handler";
    }

    Map<String, Object> getParams() throws ActionException;
    void setParams(Map<String, Object> params) throws ActionException;
    void addParams(Map<String, Object> params) throws ActionException;
    void perform() throws ActionException;
}
