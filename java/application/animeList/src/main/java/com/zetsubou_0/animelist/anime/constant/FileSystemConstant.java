package com.zetsubou_0.animelist.anime.constant;

/**
 * Created by zetsubou_0 on 01.05.15.
 */
public class FileSystemConstant {
    public static final String PATH = "/home/zetsubou_0/Anime";
    public static final String RESULTS = "/home/zetsubou_0/results";

    public static final String READ = "r";
    public static final String READ_WRITE = "rw";

    public static final String ERROR = ".error";

    public static final String JSON = ".json";
    public static final String XML = ".xml";

    public static final String ANIME_PATH_PATTERN = "(^[\\d]{4})[\\s]*-[\\s]*(([\\d])[\\s]*-[\\s]*)?(.*)([\\[]([a-zA-Z]+).*[\\]]){1}$";
    public static final String ANIME_DATE_PATTERN = "yyyy-ss";
}
