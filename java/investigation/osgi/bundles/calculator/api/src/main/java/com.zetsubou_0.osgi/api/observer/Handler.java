package com.zetsubou_0.osgi.api.observer;

/**
 * Created by Kiryl_Lutsyk on 9/4/2015.
 */
public interface Handler {
    void addListenr(Listener listener);
    void removeListener(Listener listener);
    void notifyAllListeners();
}
