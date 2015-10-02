package com.zetsubou_0.multithreading;

/**
 * Created by Kiryl_Lutsyk on 10/2/2015.
 */
public class ShutDownHook implements Runnable {
    @Override
    public void run() {
        System.out.println("ShutDownHook was invoked");
    }
}
