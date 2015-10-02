package com.zetsubou_0.pattern.journaldev.strategy;

/**
 * Created by Kiryl_Lutsyk on 10/2/2015.
 */
public class NetPay implements PayStrategy {
    private String name;
    private String resourceUrl;

    public NetPay(String name, String resourceUrl) {
        this.name = name;
        this.resourceUrl = resourceUrl;
    }

    @Override
    public void pay(int amount) {
        System.out.println("Pay by internet: url: " + resourceUrl + "[" + name + "]" + " cost (" + amount + ")");
    }
}
