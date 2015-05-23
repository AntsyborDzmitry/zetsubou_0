package com.zetsubou_0.animelist.anime.action;

import com.zetsubou_0.animelist.anime.bean.Anime;
import com.zetsubou_0.animelist.anime.exception.ActionException;
import com.zetsubou_0.animelist.anime.helper.AnimeHelper;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Created by zetsubou_0 on 22.05.15.
 */
public class ReadAnilist extends AnilistAction {
    public ReadAnilist() {
    }

    public ReadAnilist(Action action) throws ActionException {
        super(action);
    }

    @Override
    public void perform() throws ActionException {
        // get results
        String query = (String) params.get(SourceContainer.QUERY);
        Set<Anime> animeSet = searchAnime(query);

        // split results
        Set<Anime> success = new HashSet<>();
        Set<Anime> error = new HashSet<>();
        splitList(animeSet, success, error);

        // set results
        ((Map<String, Set<Anime>>) params.get(AnimeContainer.ANIME)).put(AnimeContainer.ANIME_SET, success);
        ((Map<String, Set<Anime>>)params.get(AnimeContainer.ANIME)).put(AnimeContainer.ANIME_SET_ERROR, error);
    }

    /**
     * Split results.
     *
     * @param animeSet All results
     * @param success success results
     * @param error results with error
     */
    private void splitList(Set<Anime> animeSet, Set<Anime> success, Set<Anime> error) {
        for(Anime anime : animeSet) {
            if(AnimeHelper.isNotOnlyTitle(anime)) {
                success.add(anime);
            } else {
                error.add(anime);
            }
        }
    }

}
