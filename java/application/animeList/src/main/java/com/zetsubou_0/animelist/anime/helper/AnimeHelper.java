package com.zetsubou_0.animelist.anime.helper;

import com.zetsubou_0.animelist.anime.bean.Anime;
import org.apache.commons.lang3.StringUtils;

/**
 * Created by zetsubou_0 on 23.05.15.
 */
public class AnimeHelper {

    /**
     * Valid if have not only title
     * @param anime Anime to verification.
     * @return
     */
    public static boolean isNotOnlyTitle(Anime anime) {
        boolean isValid = false;

        isValid |= StringUtils.isNotBlank(anime.getAuthor())
                | StringUtils.isNotBlank(anime.getDescription())
                | StringUtils.isNotBlank(anime.getDirectedBy())
                | anime.getEpisodesCount() > 0
                | anime.getDuration() > 0
                | anime.getStartDate() != null
                | anime.getEndDate() != null
                | (anime.getGenres() != null && anime.getGenres().size() > 0)
                | (anime.getRating() != null && anime.getRating().size() > 0)
                | anime.getType() != null;

        return isValid;
    }
}
