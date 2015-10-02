package com.zetsubou_0.pattern.journaldev.strategy;

/**
 * Created by Kiryl_Lutsyk on 10/2/2015.
 */
public class Cardpay implements PayStrategy {
    private int number;

    public Cardpay(int number) {
        this.number = number;
    }

    @Override
    public void pay(int amount) {
        System.out.println("Pay by card: " + number + " cost (" + amount + ")");
    }
}
