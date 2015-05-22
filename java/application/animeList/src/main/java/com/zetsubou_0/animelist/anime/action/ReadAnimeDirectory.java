package com.zetsubou_0.animelist.anime.action;

import com.zetsubou_0.animelist.anime.bean.Anime;
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
public class ReadAnimeDirectory extends AbstractAction {

    public ReadAnimeDirectory() {
    }

    public ReadAnimeDirectory(Action action) throws ActionException {
        super(action);
    }

    @Override
    public void perform() throws ActionException {
        Map<String, Object> source = (Map<String, Object>) params.get(SourceContainer.DIRECTORY);
        String path = (String) source.get(SourceContainer.RESOURCE_OUT);

        // results
        Map<String, Map<String, Set<Anime>>> res = new HashMap<>();
        res.put(AnimeContainer.ANIME_SET, new HashMap<String, Set<Anime>>());
        res.put(AnimeContainer.ANIME_SET_ERROR, new HashMap<String, Set<Anime>>());
        params.put(AnimeContainer.ANIME, res);

        readDisk(path);
    }

    private void readDisk(String path) {
        File root = new File(path);
        for(File directory : root.listFiles()) {
            if(directory.isDirectory()) {
                // sub directory
                Set<Anime> animeSet = new HashSet<>();
                for(final File subDirectory : directory.listFiles()) {
                    if(subDirectory.isDirectory()) {
                        Anime anime = new Anime();
                        anime.setTitles(new HashSet<String>() {{add(subDirectory.getName());}});
                        animeSet.add(anime);
                    }
                }
                Map<String, Map<String, Set<Anime>>> res = (Map<String, Map<String, Set<Anime>>>) params.get(AnimeContainer.ANIME);
                res.get(AnimeContainer.ANIME_SET).put(directory.getName(), animeSet);
            }
        }
    }

    private Anime animeFromDirectory(File file) {
        final int YEAR = 1, SECOND = 3, TITLE = 4, TYPE = 6;
        Anime anime = new Anime();
        final String name = file.getName();

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
            // save anime with error (only title)
            final Anime errorAnime = new Anime();
            errorAnime.setTitles(new HashSet<String>() {{add(name);}});
            Map<String, Map<String, Set<Anime>>> res = (Map<String, Map<String, Set<Anime>>>) params.get(AnimeContainer.ANIME);
            res.get(AnimeContainer.ANIME_SET_ERROR).put(name, new HashSet<Anime>() {{add(errorAnime);}});
        }

        return anime;
    }
}
