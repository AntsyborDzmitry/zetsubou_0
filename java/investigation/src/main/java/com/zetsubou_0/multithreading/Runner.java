package com.zetsubou_0.multithreading;

/**
 * Created by Kiryl_Lutsyk on 4/29/2015.
 */
public class Runner implements Listener {
    public static void main(String[] args) {
        Runtime.getRuntime().addShutdownHook(new Thread(new ShutDownHook()));
        Writer w = new Writer();
        Thread t = new Thread(w);
        System.out.println("Thread was created");
        t.start();
        System.exit(0);
        System.out.println("Thread was started.");
        try {
            System.out.println("Wait");
            t.join();
            System.out.println("Tread finished work.");
            System.out.println(w.getResult());
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void perform(int i) {
        System.out.println(i);
    }
}
