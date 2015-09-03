package com.zetsubou_0.osgi.calculator.core;

import java.io.PrintWriter;

/**
 * Created by Kiryl_Lutsyk on 9/2/2015.
 */
public class CalculatorShell implements Runnable {
    private PrintWriter out;

    @Override
    public void run() {
        init();
        synchronized (CalculatorShell.class) {
            try {
                CalculatorShell.class.wait();
                out.println("Process stopped.");
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

    public void setOut(PrintWriter out) {
        this.out = out;
    }

    private void init() {

    }
}
