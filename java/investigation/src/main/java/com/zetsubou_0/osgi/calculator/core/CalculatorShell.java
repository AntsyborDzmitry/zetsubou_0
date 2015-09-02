package com.zetsubou_0.osgi.calculator.core;

/**
 * Created by Kiryl_Lutsyk on 9/2/2015.
 */
public class CalculatorShell implements Runnable {
    @Override
    public void run() {
        init();
        synchronized (CalculatorShell.class) {
            try {
                CalculatorShell.class.wait();
                System.out.println("Process stopped.");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public void exit() {
        synchronized (CalculatorShell.class) {
            CalculatorShell.class.notifyAll();
        }
    }

    private void init() {

    }
}
