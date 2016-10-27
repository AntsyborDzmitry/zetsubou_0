package com.zetsubou_0.thread.synchronizer;

import java.util.Random;
import java.util.concurrent.Semaphore;

/**
 * Created by Kiryl_Lutsyk on 10/27/2016.
 */
public class SemaphoreSample {
    public static void main(String[] args) {
        Semaphore semaphore = new Semaphore(5);
        Random random = new Random();
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                try {
                    Thread.sleep(random.nextInt(1_000));
                    semaphore.acquire();
                    System.out.println("Hi, I'm thread " + Thread.currentThread().getName());
                    semaphore.release();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }).start();
        }
    }
}
