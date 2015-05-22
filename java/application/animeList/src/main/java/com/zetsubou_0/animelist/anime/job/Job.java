package com.zetsubou_0.animelist.anime.job;

import com.zetsubou_0.animelist.anime.action.Action;
import com.zetsubou_0.animelist.anime.observer.Handler;

/**
 * Created by zetsubou_0 on 22.05.15.
 */
public interface Job extends Runnable, Handler {
    void setAction(Action action);
    Action getAction();
}
