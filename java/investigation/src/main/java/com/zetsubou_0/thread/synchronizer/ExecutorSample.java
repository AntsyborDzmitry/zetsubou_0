package com.zetsubou_0.thread.synchronizer;

import java.util.Random;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

/**
 * Created by Kiryl_Lutsyk on 10/27/2016.
 */
public class ExecutorSample {
    public static void main(String[] args) throws InterruptedException {
        ExecutorService executorService = Executors.newCachedThreadPool();
        Random random = new Random();
        for (int i = 0; i < 20; i++) {
            executorService.submit(() -> {
                try {
                    Thread.sleep(random.nextInt(1_000));
                    System.out.println("Hi, I'm thread " + Thread.currentThread().getName());
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            });
        }
        try {
            executorService.awaitTermination(5, TimeUnit.SECONDS);
        } finally {
            executorService.shutdown();
        }
    }
}
