package com.zetsubou_0.thread.synchronizer;

import java.util.Random;
import java.util.concurrent.CountDownLatch;

/**
 * Created by Kiryl_Lutsyk on 10/27/2016.
 */
public class CountDownLatchSample {
    public static void main(String[] args) {
        CountDownLatch latch = new CountDownLatch(5);
        Random random = new Random();
        for (int i = 0; i < 5; i++) {
            System.out.println(i);
            new Thread(() -> {
                try {
                    latch.countDown();
                    Thread.sleep(random.nextInt(1_000));
                    System.out.println("Hi, I'm thread " + Thread.currentThread().getName());
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }).start();
        }
    }
}
