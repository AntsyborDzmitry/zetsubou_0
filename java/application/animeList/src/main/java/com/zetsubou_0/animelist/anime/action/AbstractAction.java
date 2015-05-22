package com.zetsubou_0.animelist.anime.action;

import com.zetsubou_0.animelist.anime.exception.ActionException;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by zetsubou_0 on 22.05.15.
 */
public abstract class AbstractAction implements Action {
    protected Map<String, Object> params = new HashMap<>();

    public AbstractAction() {
    }

    public AbstractAction(Action action) throws ActionException {
        params.putAll(action.getParams());
    }

    @Override
    public Map<String, Object> getParams() throws ActionException {
        return params;
    }

    @Override
    public void setParams(Map<String, Object> params) throws ActionException {
        this.params = params;
    }

    @Override
    public void addParams(Map<String, Object> params) throws ActionException {
        this.params.putAll(params);
    }

}
