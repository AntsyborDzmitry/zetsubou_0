package com.zetsubou_0.anime.action;

import com.zetsubou_0.anime.exception.ActionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

/**
 * Created by zetsubou_0 on 01.05.15.
 */
public interface Action {
    static final Logger LOG = LoggerFactory.getLogger(Action.class);

    Map<String, Object> getParams() throws ActionException;
    void setParams(Map<String, Object> params) throws ActionException;
    void addParams(Map<String, Object> params) throws ActionException;
    void perform() throws ActionException;
}
