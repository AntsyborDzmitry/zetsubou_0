package com.zetsubou_0.animelist.anime.constant;

/**
 * Created by zetsubou_0 on 04.05.15.
 */
public class JcrConstant {
    public static class Repository {
        public static final String LOCAL_REPOSYTORY_RMI = "//localhost/jackrabbit.repository";
        public static final String LOCAL_REPOSYTORY_HTTP = "http://localhost:4509/rmi";
        public static final String DEFAULT_USER = "admin";
        public static final char[] DEFAULT_PASSWORD = "admin".toCharArray();
    }

    public static class Store {
        public static final String WORKSPACE = "anime-store";
        public static final String ANIME_FOLDER = "anime";
        public static final String SEIYUU_FOLDER = "seiyuu";
        public static final String ANIME_PATH = "/anime/%s";
        public static final String SEIYUU_PATH = "/seiyuu/%s";

    }
}
