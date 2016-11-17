package com.zetsubou_0.thread;

/**
 * Created by Kiryl_Lutsyk on 10/26/2016.
 */
public class ThreadDemo {
    public static void main(String[] args) {
        Thread thread = new MyThread();
        thread.start();
    }
}

class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("Run");
    }
}