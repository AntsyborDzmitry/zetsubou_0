package com.zetsubou_0.animelist.anime.action;

import com.zetsubou_0.animelist.anime.bean.Anime;
import com.zetsubou_0.animelist.anime.bean.Series;
import com.zetsubou_0.animelist.anime.constant.ActionConstant;
import com.zetsubou_0.animelist.anime.constant.FileSystemConstant;
import com.zetsubou_0.animelist.anime.enums.AnimeType;
import com.zetsubou_0.animelist.anime.exception.ActionException;
import com.zetsubou_0.animelist.anime.exception.AnimeTypeException;
import com.zetsubou_0.animelist.anime.helper.AnimeTypeServiceImpl;
import org.apache.commons.lang3.StringUtils;

import java.io.File;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by zetsubou_0 on 01.05.15.
 */
public class ReadAnimeDirectory implements Action {
    private Map<String, Object> params = new HashMap<>();
    private String path;

    public ReadAnimeDirectory() {
    }

    public ReadAnimeDirectory(Action action) throws ActionException {
        params.putAll(action.getParams());
    }

    @Override
    public Map<String, Object> getParams() throws ActionException {
        return params;
    }

    @Override
    public void setParams(Map<String, Object> params) throws ActionException {
        this.params = params;
    }

    @Override
    public void addParams(Map<String, Object> params) throws ActionException {
        this.params.putAll(params);
    }

    @Override
    public void perform() throws ActionException {
        Map<String, Object> source = (Map<String, Object>) params.get(ActionConstant.Source.DIRECTORY);
        path = (String) source.get(ActionConstant.Source.RESOURCE_PATH);
        params.put(ActionConstant.Anilist.ANIME_SERIES_SET, readDisk());
    }

    private Set<Series<Anime>> readDisk() {
        Set<Series<Anime>> animeSeriesSet = new HashSet<>();

        File root = new File(path);
        for(File directory : root.listFiles()) {
            if(directory.isDirectory()) {
                Series<Anime> series = new Series<>();
                series.setId(directory.getName());

                // sub directory
                Set<Anime> animeSet = new HashSet<>();
                for(File subDirectory : directory.listFiles()) {
                    if(subDirectory.isDirectory()) {
                        animeSet.add(animeFromDirectory(subDirectory));
                    }
                }

                series.setSeriesSet(animeSet);

                animeSeriesSet.add(series);
            }
        }

        return animeSeriesSet;
    }

    private Anime animeFromDirectory(File file) {
        final int YEAR = 1, SECOND = 3, TITLE = 4, TYPE = 6;
        Anime anime = new Anime();
        String name = file.getName();

        Pattern p = Pattern.compile(FileSystemConstant.ANIME_PATH_PATTERN);
        Matcher m = p.matcher(name);

        if(m.find()) {
            String yearString = m.group(YEAR);
            String secondString = m.group(SECOND);
            String title = m.group(TITLE);
            String typeString = m.group(TYPE);

            // titles
            Set<String> titles = new HashSet<>();
            titles.add(title);
            anime.setTitles(titles);

            // type
            AnimeType type = null;
            try {
                if(StringUtils.isNotBlank(typeString)) {
                    type = new AnimeTypeServiceImpl().convert(typeString);
                }
            } catch (AnimeTypeException e) {
                LOG.error(e.getMessage(), e);
            }
            anime.setType(type);

            // date
            Date date = null;
            Integer year = 0;
            Integer second = 0;

            if(StringUtils.isNotBlank(yearString)) {
                year = Integer.parseInt(yearString);
                if(StringUtils.isNotBlank(secondString)) {
                    second = Integer.parseInt(m.group(SECOND));
                }

                SimpleDateFormat format = new SimpleDateFormat(FileSystemConstant.ANIME_DATE_PATTERN);
                try {
                    date = format.parse(year + "-" + second);
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }
            anime.setEndDate(date);

        } else {
            System.err.println("Not found - " + file.getAbsolutePath());
        }

        return anime;
    }
}
