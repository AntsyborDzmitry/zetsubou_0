package com.zetsubou_0.osgi.calculator.ui;

import com.zetsubou_0.osgi.api.ShellCommand;
import com.zetsubou_0.osgi.api.exception.CommandException;
import com.zetsubou_0.osgi.api.exception.OperationException;
import com.zetsubou_0.osgi.calculator.core.CalculatorThread;
import com.zetsubou_0.osgi.calculator.core.command.*;

import javax.swing.*;
import javax.swing.filechooser.FileNameExtensionFilter;
import java.awt.*;
import java.awt.event.*;
import java.io.File;
import java.util.*;
import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 9/3/2015.
 */
public class Window extends AbstractUI {
    private static final int WIDTH = 800;
    private static final int HEIGHT = 600;
    private static final String[] EMPTY_OPERATIONS = new String[]{"Operations not found"};

    private JFrame window;
    private JTextField inputText;
    private JButton calculateButton;
    private JLabel resultValue;
    private JList<String> bundlesList;
    private JButton addButton;
    private JButton removeButton;

    public Window(CalculatorThread calculatorThread) {
        super(calculatorThread);
        init();
    }

    @Override
    public double calculate(String input) throws CommandException {
        Map<String, Object> params = new HashMap<>();
        params.put(ShellCommand.CALCULATOR_THREAD, calculatorThread);
        params.put(ShellCommand.INPUT_STRING, input);
        ShellCommand calculate = new Calculate();
        calculate.execute(params);
        return (double) params.get(ShellCommand.RESULT);
    }

    @Override
    public void addOperation(String path, String protocol) throws CommandException {
        Map<String, Object> params = new HashMap<>();
        params.put(ShellCommand.CALCULATOR_THREAD, calculatorThread);
        params.put(ShellCommand.PATH, path);
        params.put(ShellCommand.PROTOCOL, protocol);
        ShellCommand command = new Add();
        command.execute(params);
    }

    @Override
    public void removeOperation(List<String> names) throws CommandException {
        Map<String, Object> params = new HashMap<>();
        params.put(ShellCommand.CALCULATOR_THREAD, calculatorThread);
        params.put(ShellCommand.OPERATIONS, names);
        ShellCommand command = new Remove();
        command.execute(params);

    }

    @Override
    public List<String> operationsList() throws CommandException {
        Map<String, Object> params = new HashMap<>();
        params.put(ShellCommand.CALCULATOR_THREAD, calculatorThread);
        ShellCommand update = new UpdateOperationList();
        update.execute(params);
        return  (List<String>) params.get(ShellCommand.OPERATIONS);
    }

    @Override
    public void exitCalculator() throws CommandException {
        Map<String, Object> params = new HashMap<>();
        params.put(ShellCommand.CALCULATOR_THREAD, calculatorThread);
        ShellCommand exit = new Exit();
        exit.execute(params);
    }

    @Override
    public void perform() {
        updateBundles();
    }

    @Override
    public void run() {
        window.setVisible(true);
    }

    private void updateBundles() {
        try {
            List<String> bundlesTempList = operationsList();
            String[] bundles = new String[bundlesTempList.size()];
            bundles = bundlesTempList.toArray(bundles);
            if(bundles.length == 0) {
                bundlesList.setListData(EMPTY_OPERATIONS);
            } else {
                bundlesList.setListData(bundles);
            }
        } catch (CommandException ex) {
            resultValue.setText(ex.getMessage());
        }
        refreshWindow();
    }

    private void init() {
        window = this;
        setResizable(false);
        createFrame();
        refreshWindow();
    }

    private void refreshWindow() {
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
        JLabel operationLabel = new JLabel("Operations in system: ");
        bundlesList = new JList<>();
        bundlePanel.add(operationLabel);
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
                try {
                    Window.this.exitCalculator();
                    window.dispose();
                } catch (CommandException ex) {
                    resultValue.setText(ex.getMessage());
                }
            }
        };
        window.addWindowListener(exitListener);

        // calculate button
        ActionListener calculateListener = new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                try {
                    resultValue.setText(String.valueOf(Window.this.calculate(inputText.getText())));
                } catch (CommandException ex) {
                    resultValue.setText(ex.getMessage());
                }
                refreshWindow();
            }
        };
        calculateButton.addActionListener(calculateListener);

        // upload bundle
        ActionListener addBundle = new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                JFileChooser fileChooser = new JFileChooser();
                fileChooser.setMultiSelectionEnabled(true);
                FileNameExtensionFilter filter = new FileNameExtensionFilter("Java archives", "jar");
                fileChooser.setFileFilter(filter);
                int returnVal = fileChooser.showOpenDialog(Window.this);
                if(returnVal == JFileChooser.APPROVE_OPTION) {
                    StringBuilder errors = new StringBuilder();
                    for(File file : fileChooser.getSelectedFiles()) {
                        String path = file.getAbsolutePath();
                        if(!path.endsWith(".jar")) {
                            // skip if not jar file
                            continue;
                        }
                        try {
                            Window.this.addOperation(path, "file:");
                        } catch (CommandException ex) {
                            resultValue.setText(ex.getMessage());
                        }
                    }
                    if(errors.length() > 0) {
                        resultValue.setText(errors.toString());
                    }
                    refreshWindow();
                }
            }
        };
        addButton.addActionListener(addBundle);

        // remove bundle
        ActionListener removeBundle = new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                try {
                    Window.this.removeOperation(bundlesList.getSelectedValuesList());
                } catch (CommandException ex) {
                    resultValue.setText(ex.getMessage());
                }
            }
        };
        removeButton.addActionListener(removeBundle);
    }
}
