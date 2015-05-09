package com.epam.pattern.headfirst.observer.weatherstantion.custom.handler;

import com.epam.pattern.headfirst.observer.weatherstantion.custom.listener.Listener;

/**
 * Created by Kiryl_Lutsyk on 1/12/2015.
 */
public interface Handler {
    void register(Listener listener);
    void remove(Listener listener);
    void notifyListener();
}
