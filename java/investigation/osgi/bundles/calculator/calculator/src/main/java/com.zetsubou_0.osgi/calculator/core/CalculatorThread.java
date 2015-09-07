package com.zetsubou_0.osgi.calculator.core;

import com.zetsubou_0.osgi.api.Operation;
import com.zetsubou_0.osgi.api.ShellCommand;
import com.zetsubou_0.osgi.api.exception.CommandException;
import com.zetsubou_0.osgi.api.exception.OperationException;
import com.zetsubou_0.osgi.calculator.core.command.Add;
import com.zetsubou_0.osgi.calculator.core.command.Remove;
import com.zetsubou_0.osgi.calculator.helper.BundleHelper;
import com.zetsubou_0.osgi.calculator.observer.BundleTracker;
import com.zetsubou_0.osgi.calculator.ui.AbstractUI;
import com.zetsubou_0.osgi.calculator.ui.Window;
import org.osgi.framework.BundleContext;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Kiryl_Lutsyk on 9/2/2015.
 */
public class CalculatorThread implements Runnable {
    private BundleContext bundleContext;
    private BundleTracker bundleTracker;

    private CalculatorThread() {}

    public CalculatorThread(BundleContext bundleContext) {
        this.bundleContext = bundleContext;
        this.bundleTracker = new BundleTracker(bundleContext);
    }

    @Override
    public void run() {
        init();
        synchronized (CalculatorThread.class) {
            try {
                CalculatorThread.class.wait();
                new Thread(new CalculatorThreadKiller(bundleContext)).run();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public double calculate(String input) throws OperationException {
        Calculator calculator = new Calculator(bundleTracker.getCache());
        return calculator.calculate(input);
    }

    public List<String> getOperations() {
        return BundleHelper.getHeader(bundleTracker.getCache(), Operation.OPERATION_NAME);
    }

    public void exit() {
        synchronized (CalculatorThread.class) {
            System.out.println("Calculator closing...");
            bundleTracker.stopTracking();
            CalculatorThread.class.notifyAll();
        }
    }

    public void uploadBundle(String path) throws CommandException {
        Map<String, Object> params = new HashMap<>();
        params.put(ShellCommand.BUNDLE_CONTEXT, bundleContext);
        params.put(ShellCommand.PATH, path);
        params.put(ShellCommand.PROTOCOL, "file:");
        ShellCommand command = new Add();
        command.execute(params);
    }

    public void uninstallBundle(List<String> operations) throws CommandException {
        Map<String, Object> params = new HashMap<>();
        params.put(ShellCommand.CACHE, bundleTracker.getCache());
        params.put(ShellCommand.OPERATIONS, operations);
        ShellCommand command = new Remove();
        command.execute(params);
    }

    private void init() {
        bundleTracker.startTracking();
        AbstractUI window = new Window(this);
        bundleTracker.addListenr(window);
        new Thread(window).start();
    }
}
