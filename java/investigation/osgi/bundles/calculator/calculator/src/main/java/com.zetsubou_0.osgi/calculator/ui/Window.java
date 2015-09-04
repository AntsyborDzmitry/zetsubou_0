package com.zetsubou_0.osgi.calculator.ui;

import com.zetsubou_0.osgi.api.exception.OperationException;
import com.zetsubou_0.osgi.calculator.core.CalculatorThread;
import com.zetsubou_0.osgi.api.observer.Listener;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 9/3/2015.
 */
public class Window extends JFrame implements Listener, Runnable {
    private static final int WIDTH = 800;
    private static final int HEIGHT = 600;

    public CalculatorThread calculatorThread;
    private JFrame window;
    private JTextField inputText;
    private JButton calculateButton;
    private JLabel resultValue;
    private JList<String> bundlesList;
    private JButton addButton;
    private JButton removeButton;

    private Window() {}

    public Window(CalculatorThread calculatorThread) {
        this.calculatorThread = calculatorThread;
        init();
    }

    @Override
    public void perform() {
        updateBundles();
    }

    @Override
    public void run() {
        window.setVisible(true);
    }

    public void updateBundles() {
        List<String> bundlesTempList = calculatorThread.getOperations();
        String[] bundles = new String[bundlesTempList.size()];
        bundles = bundlesTempList.toArray(bundles);
        bundlesList.setListData(bundles);
    }

    private void init() {
        window = this;
        setResizable(false);
        createFrame();
        pack();
        centredWindow();
    }

    private void centredWindow() {
        Dimension dimension = Toolkit.getDefaultToolkit().getScreenSize();
        int x = (int) ((dimension.getWidth() - this.getWidth()) / 2);
        int y = (int) ((dimension.getHeight() - this.getHeight()) / 2);
        window.setLocation(x, y);
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
        inputText = new JTextField(40);
        inputPanel.add(inputLabel);
        inputPanel.add(inputText);

        // fill input button panel
        calculateButton = new JButton("Calculate");
        inputButtonPanel.add(calculateButton);

        // fill result panel
        JLabel resultLabel = new JLabel("Result: ");
        resultValue = new JLabel();
        resultPanel.add(resultLabel);
        resultPanel.add(resultValue);

        // fill bundle panel
        bundlesList = new JList<>();
        bundlePanel.add(bundlesList);
        updateBundles();

        // fill bundle buttons
        addButton = new JButton("Add");
        removeButton = new JButton("Remove");
        bundleButtonPanel.add(addButton);
        bundleButtonPanel.add(removeButton);

        initListeners();

        Container container = window.getContentPane();
        container.setLayout(new GridLayout(5, 1));
        container.add(inputPanel);
        container.add(inputButtonPanel);
        container.add(resultPanel);
        container.add(bundlePanel);
        container.add(bundleButtonPanel);
    }

    private void initListeners() {
        // close window
        WindowListener exitListener = new WindowAdapter() {
            @Override
            public void windowClosing(WindowEvent e) {
                int confirm = JOptionPane.showOptionDialog(
                        null, "Are You Sure to Close Application?",
                        "Exit Confirmation", JOptionPane.YES_NO_OPTION,
                        JOptionPane.QUESTION_MESSAGE, null, null, null);
                if (confirm == 0) {
                    calculatorThread.exit();
                    window.dispose();
                }
            }
        };
        window.addWindowListener(exitListener);

        // calculate button
        ActionListener calculateListener = new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                try {
                    Double result = calculatorThread.calculate(inputText.getText());
                    resultValue.setText(result.toString());
                } catch (OperationException ex) {
                    resultValue.setText(ex.getMessage());
                    window.pack();
                }
            }
        };
        calculateButton.addActionListener(calculateListener);

        // upload bundle

    }
}
