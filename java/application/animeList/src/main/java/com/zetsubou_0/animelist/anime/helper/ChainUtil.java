package com.zetsubou_0.animelist.anime.helper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zetsubou_0 on 25.05.15.
 */
public class ChainUtil {
    /**
     * Get value of last key in keys chain from params
     *
     * @param keysChain list of keys
     * @param params map consist keys and value
     * @return value of last key in keys chain
     */
    public static Object getInnerParam(List<String> keysChain, Map<String, Object> params) {
        String key = keysChain.get(keysChain.size() - 1);
        return getInnerParamMap(keysChain, params).get(key);
    }

    /**
     * Get map of last - 1 key in keys chain from params
     * This map consist last key
     *
     * @param keysChain list of keys
     * @param params map consist keys and value
     * @return value of last key in keys chain
     */
    public static Map<String, Object> getInnerParamMap(List<String> keysChain, Map<String, Object> params) {
        String key = keysChain.get(0);
        Map<String, Object> p = (Map<String, Object>) params.get(key);
        if(keysChain.size() > 2) {
            keysChain.remove(key);
            return getInnerParamMap(keysChain, p);
        }
        return p;
    }

    public static Map<String, Object> createChain(List<String> keysChain, Object value) {
        List<String> keysChainCopy = new ArrayList<>(keysChain);
        Map<String, Object> chain = new HashMap<>();
        if(keysChainCopy.size() > 0) {
            String param = keysChainCopy.get(keysChainCopy.size() - 1);
            chain.put(param, value);
            keysChainCopy.remove(param);
            return createChain(keysChainCopy, chain);
        }
        return (Map<String, Object>) value;
    }
}
