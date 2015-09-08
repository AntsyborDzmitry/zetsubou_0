package com.zetsubou_0.osgi.api.ui;

import com.zetsubou_0.osgi.api.exception.CommandException;

import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 9/8/2015.
 */
public interface CalculatorUI extends Runnable {
    double calculate(String input) throws CommandException;
    void addOperation(String path, String protocol) throws CommandException;
    void removeOperation(List<String> names) throws CommandException;
    List<String> operationsList() throws CommandException;
    void exitCalculator() throws CommandException;
}
