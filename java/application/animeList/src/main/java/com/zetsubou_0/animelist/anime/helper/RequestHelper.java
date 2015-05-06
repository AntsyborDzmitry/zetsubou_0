package com.zetsubou_0.animelist.anime.helper;

import com.zetsubou_0.animelist.anime.exception.RequestInitConnectionException;
import com.zetsubou_0.animelist.anime.exception.RequestSendException;

import java.util.Map;

/**
 * Created by zetsubou_0 on 23.04.15.
 */
public interface RequestHelper {
    public static final String DEFAULT_ENCODING = "UTF-8";
    public static final String KEY_URL = "url";
    public static final String KEY_PROXY = "proxy";
    public static final String KEY_METHOD = "method";
    public static final String KEY_ENCODING = "encoding";
    public static final String KEY_HEADERS = "headers";
    public static final String KEY_QUERY = "query";

    void init(Map<String, Object> params) throws RequestInitConnectionException;
    String send() throws RequestSendException;
}
