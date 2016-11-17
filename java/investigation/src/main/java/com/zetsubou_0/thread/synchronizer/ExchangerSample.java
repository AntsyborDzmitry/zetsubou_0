package com.zetsubou_0.thread.synchronizer;

import com.zetsubou_0.thread.synchronizer.been.Cat;

import java.util.concurrent.Exchanger;

/**
 * Created by Kiryl_Lutsyk on 10/27/2016.
 */
public class ExchangerSample {
    public static void main(String[] args) {
        Exchanger<Cat> catTransport = new Exchanger<>();

        new Thread(() -> {
            try {
                Cat cat = catTransport.exchange(new Cat("nynko", 5));
                System.out.println("1 - " + cat);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();

        new Thread(() -> {
            try {
                Cat cat = catTransport.exchange(new Cat("cat", 10));
                System.out.println("2 - " + cat);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    }
}
