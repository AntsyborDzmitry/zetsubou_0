package com.zetsubou_0.anime.helper;

import com.zetsubou_0.anime.constant.AnimeTypeServiceConstant;
import com.zetsubou_0.anime.enums.AnimeType;
import com.zetsubou_0.anime.exception.AnimeTypeException;

/**
 * Created by zetsubou_0 on 23.04.15.
 */
public class AnimeTypeServiceImpl implements AnimeTypeService {
    private String type;

    @Override
    public AnimeType convert(String type) throws AnimeTypeException {
        this.type = type.toLowerCase().trim();

        if(isTV()) {
            return AnimeType.TV;
        } else if(isGekijouban()) {
            return AnimeType.GEKIJOUBAN;
        } else if(isONA()) {
            return AnimeType.ONA;
        } else if(isOVA()) {
            return AnimeType.OVA;
        } else if(isSpecial()) {
            return AnimeType.SPICIAL;
        } else if(isMusic()) {
            return AnimeType.MUSIC;
        } else {
            throw new AnimeTypeException("Unknown type of anime \"" + type + "\"");
        }

    }

    private boolean isTV() {
        boolean isSpecial = false;

        for(String type : AnimeTypeServiceConstant.TV) {
            isSpecial |= type.equals(this.type);
        }

        return isSpecial;
    }

    private boolean isGekijouban() {
        boolean isSpecial = false;

        for(String type : AnimeTypeServiceConstant.GEKIJOUBAN) {
            isSpecial |= type.equals(this.type);
        }

        return isSpecial;
    }

    private boolean isONA() {
        boolean isSpecial = false;

        for(String type : AnimeTypeServiceConstant.ONA) {
            isSpecial |= type.equals(this.type);
        }

        return isSpecial;
    }

    private boolean isOVA() {
        boolean isSpecial = false;

        for(String type : AnimeTypeServiceConstant.OVA) {
            isSpecial |= type.equals(this.type);
        }

        return isSpecial;
    }

    private boolean isSpecial() {
        boolean isSpecial = false;

        for(String type : AnimeTypeServiceConstant.SPECIAL) {
            isSpecial |= type.equals(this.type);
        }

        return isSpecial;
    }

    private boolean isMusic() {
        boolean isSpecial = false;

        for(String type : AnimeTypeServiceConstant.MUSIC) {
            isSpecial |= type.equals(this.type);
        }

        return isSpecial;
    }
}
