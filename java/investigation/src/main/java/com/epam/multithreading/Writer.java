package com.epam.multithreading;

import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Created by Kiryl_Lutsyk on 4/29/2015.
 */
public class Writer implements Runnable, Handler {
    private int result = 10;
    private List<Listener> listeners;

    @Override
    public void run() {
        try {
            TimeUnit.SECONDS.sleep(3);
            System.out.println("bla-bla");
            result = 3;
            TimeUnit.SECONDS.sleep(3);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void addListener(Listener listener) {
        listeners.add(listener);
    }

    public int getResult() {
        return result;
    }
}
