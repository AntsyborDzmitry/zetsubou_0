package com.zetsubou_0.osgi.calculator.ui;

import com.zetsubou_0.osgi.api.observer.BundleUpdateListener;
import com.zetsubou_0.osgi.api.ui.CalculatorUI;
import com.zetsubou_0.osgi.calculator.core.CalculatorThread;

import javax.swing.*;

/**
 * Created by Kiryl_Lutsyk on 9/7/2015.
 */
public abstract class AbstractUI extends JFrame implements BundleUpdateListener, CalculatorUI {
    protected CalculatorThread calculatorThread;

    private AbstractUI() {}

    public AbstractUI(CalculatorThread calculatorThread) {
        this.calculatorThread = calculatorThread;
    }
}
