package com.zetsubou_0.anime.helper;

import com.zetsubou_0.anime.enums.AnimeType;
import com.zetsubou_0.anime.exception.AnimeTypeException;

/**
 * Created by zetsubou_0 on 23.04.15.
 */
public interface AnimeTypeService {
    AnimeType convert(String type) throws AnimeTypeException;
}
