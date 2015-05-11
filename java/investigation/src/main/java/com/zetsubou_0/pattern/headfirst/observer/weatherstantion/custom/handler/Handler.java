package com.zetsubou_0.pattern.headfirst.observer.weatherstantion.custom.handler;

import com.zetsubou_0.pattern.headfirst.observer.weatherstantion.custom.listener.Listener;

/**
 * Created by Kiryl_Lutsyk on 1/12/2015.
 */
public interface Handler {
    void register(Listener listener);
    void remove(Listener listener);
    void notifyListener();
}
