package com.zetsubou_0.anime.observer;

/**
 * Created by zetsubou_0 on 02.05.15.
 */
public interface Handler {
    void addlistener(Listener listener);
    void removeListener(Listener listener);
}
