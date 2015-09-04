package com.zetsubou_0.osgi.calculator.ui;

import com.zetsubou_0.osgi.calculator.core.CalculatorAction;

import javax.swing.*;
import java.awt.*;

/**
 * Created by Kiryl_Lutsyk on 9/3/2015.
 */
public class Window extends JFrame {
    private static final int WIDTH = 800;
    private static final int HEIGHT = 600;

    public CalculatorAction calculatorAction;

    public Window() {
        init();
    }

    public Window(CalculatorAction calculatorAction) {
        this.calculatorAction = calculatorAction;
        init();
    }

    private void init() {
        createFrame();
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        pack();
        centredWindow();
        this.setVisible(true);
    }

    private void centredWindow() {
        Dimension dimension = Toolkit.getDefaultToolkit().getScreenSize();
        int x = (int) ((dimension.getWidth() - this.getWidth()) / 2);
        int y = (int) ((dimension.getHeight() - this.getHeight()) / 2);
        this.setLocation(x, y);
    }

    private void createFrame() {
        // set size
        Dimension windowSize = new Dimension(WIDTH, HEIGHT);
        this.setSize(windowSize);

        // create panels
        JPanel inputPanel = new JPanel();
        JPanel inputButtonPanel = new JPanel();
        JPanel resultPanel = new JPanel();
        JPanel bundlePanel = new JPanel();
        JPanel bundleButtonPanel = new JPanel();

        // fill input panel
        JLabel inputLabel = new JLabel("Input string: ");
        JTextField inputText = new JTextField(40);
        inputPanel.add(inputLabel);
        inputPanel.add(inputText);

        // fill input button panel
        JButton calculateButton = new JButton("Calculate");
        inputButtonPanel.add(calculateButton);

        // fill result panel
        JLabel resultLabel = new JLabel("Result: ");
        JLabel resultValue = new JLabel();
        resultPanel.add(resultLabel);
        resultPanel.add(resultValue);

        // fill bundle panel
        JList<String> bundlesList = new JList<>(new String[] {"1", "2", "3", "4"});
        bundlePanel.add(bundlesList);

        // fill bundle buttons
        JButton addButton = new JButton("Add");
        JButton removeButton = new JButton("Remove");
        bundleButtonPanel.add(addButton);
        bundleButtonPanel.add(removeButton);

        Container container = this.getContentPane();
        container.setLayout(new GridLayout(5, 1));
        container.add(inputPanel);
        container.add(inputButtonPanel);
        container.add(resultPanel);
        container.add(bundlePanel);
        container.add(bundleButtonPanel);
    }
}
