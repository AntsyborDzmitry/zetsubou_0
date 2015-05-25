package com.zetsubou_0.animelist.anime.helper;

import com.zetsubou_0.animelist.anime.bean.Anime;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by zetsubou_0 on 25.05.15.
 */
public class ActionHelper {
    public static void transformActionParams(List<String> keyChainFrom, List<String> keyChainTo, Map<String, Object> params) {
        Object value = ChainUtil.getInnerParam(keyChainFrom, params);
        ChainUtil.getInnerParamMap(keyChainTo, params).put(keyChainTo.get(keyChainTo.size() - 1), value);
    }

    public static void transformAnimeStringParams(List<String> keyChainFrom, List<String> keyChainTo, Map<String, Object> params) {
        Map<String, Set<Anime>> valueMap = (Map<String, Set<Anime>>) ChainUtil.getInnerParam(keyChainFrom, params);
        List<String> valueList = new ArrayList<>(valueMap.keySet());
        if(valueList != null && valueList.size() > 0) {
            // value
            String value = valueList.get(0);
            // value encapsulate in map
            Map<String, Object> paramMap = ChainUtil.createChain(keyChainTo, value);
            params.putAll(paramMap);
            // remove from value map
            valueMap.remove(value);
        }
    }
}
