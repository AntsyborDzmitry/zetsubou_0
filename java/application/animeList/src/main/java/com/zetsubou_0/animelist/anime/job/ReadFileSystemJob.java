package com.zetsubou_0.animelist.anime.job;

import com.zetsubou_0.animelist.anime.bean.Anime;
import com.zetsubou_0.animelist.anime.constant.FileSystemConstant;
import com.zetsubou_0.animelist.anime.enums.AnimeType;
import com.zetsubou_0.animelist.anime.exception.AnimeTypeException;
import com.zetsubou_0.animelist.anime.exception.JobException;
import com.zetsubou_0.animelist.anime.helper.AnimeTypeServiceImpl;
import org.apache.commons.lang3.StringUtils;

import java.io.File;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by zetsubou_0 on 22.05.15.
 */
public class ReadFileSystemJob extends AbstractJob {
    private Set<Anime> animeSet = new HashSet<>();
    private Set<Anime> animeSetError = new HashSet<>();
    private Map<String, Set<Anime>> animeSeries = new HashMap<>();

    @Override
    public void action() throws JobException {
        String path = (String) params.get(SourceContainer.RESOURCE_OUT);

        if(StringUtils.isNotBlank(path)) {
            readDisk(path);
        }
        params.put(AnimeContainer.ANIME_SERIES, animeSeries);
        params.put(AnimeContainer.ANIME_SET_ERROR, animeSetError);
    }

    private void readDisk(String path) {
        File root = new File(path);
        for(File directory : root.listFiles()) {
            if(directory.isDirectory()) {
                animeSet = new HashSet<>();
                animeSetError = new HashSet<>();
                // sub directory
                for(final File subDirectory : directory.listFiles()) {
                    if(subDirectory.isDirectory()) {
                        animeFromDirectory(subDirectory);
                    }
                }
                animeSeries.put(directory.getName(), animeSet);
            }
        }
    }

    private void animeFromDirectory(File file) {
        final int YEAR = 1, SECOND = 3, TITLE = 4, TYPE = 6;
        Anime anime = new Anime();
        final String name = file.getName();

        Pattern p = Pattern.compile(FileSystemConstant.ANIME_PATH_PATTERN);
        Matcher m = p.matcher(name);

        if(m.find()) {
            String yearString = m.group(YEAR);
            String secondString = m.group(SECOND);
            String title = m.group(TITLE);
            title = (title != null) ? title.trim() : title;
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
            anime.setStartDate(date);

            animeSet.add(anime);
        } else {
            // save anime with error (only title)
            final Anime errorAnime = new Anime();
            errorAnime.setTitles(new HashSet<String>() {{
                add(name);
            }});

            animeSetError.add(anime);
        }
    }
}
