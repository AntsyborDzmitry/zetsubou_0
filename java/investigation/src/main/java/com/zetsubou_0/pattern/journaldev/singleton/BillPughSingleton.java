package com.zetsubou_0.pattern.journaldev.singleton;

/**
 * Created by Kiryl_Lutsyk on 10/30/2015.
 */
public class BillPughSingleton {

    private BillPughSingleton(){}

    private static class SingletonHelper{
        private static final BillPughSingleton INSTANCE = new BillPughSingleton();
        static {
            System.out.println("execute BillPughSingleton");
        }
    }

    public static BillPughSingleton getInstance(){
        return SingletonHelper.INSTANCE;
    }
}