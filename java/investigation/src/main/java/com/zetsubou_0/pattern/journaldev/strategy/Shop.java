package com.zetsubou_0.pattern.journaldev.strategy;

/**
 * Created by Kiryl_Lutsyk on 10/2/2015.
 */
public class Shop {
    public static void buy(String item, int cost, PayStrategy payStrategy) {
        System.out.print("Buy " + item + " ");
        payStrategy.pay(cost);
    }
}
