package com.zetsubou_0.anime.service.metadata;

import com.zetsubou_0.anime.action.Action;
import com.zetsubou_0.anime.bean.Anime;
import com.zetsubou_0.anime.bean.Series;

import java.util.Set;

/**
 * Created by zetsubou_0 on 20.04.15.
 */
public interface AnimeData {
    void pullData(Action action);
}
