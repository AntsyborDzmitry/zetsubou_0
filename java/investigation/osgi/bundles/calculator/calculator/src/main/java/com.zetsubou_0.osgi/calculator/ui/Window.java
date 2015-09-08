package com.zetsubou_0.osgi.calculator.ui;

import com.zetsubou_0.osgi.api.ShellCommand;
import com.zetsubou_0.osgi.api.exception.CommandException;
import com.zetsubou_0.osgi.api.exception.OperationException;
import com.zetsubou_0.osgi.calculator.core.CalculatorThread;
import com.zetsubou_0.osgi.calculator.core.command.Add;
import com.zetsubou_0.osgi.calculator.core.command.Exit;
import com.zetsubou_0.osgi.calculator.core.command.Remove;
import com.zetsubou_0.osgi.calculator.core.command.UpdateOperationList;

import javax.swing.*;
import javax.swing.filechooser.FileNameExtensionFilter;
import java.awt.*;
import java.awt.event.*;
import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public void perform() {
        updateBundles();
    }

    @Override
    public void run() {
        window.setVisible(true);
    }

    private void updateBundles() {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put(ShellCommand.CALCULATOR_THREAD, calculatorThread);
            ShellCommand update = new UpdateOperationList();
            update.execute(params);
            List<String> bundlesTempList = (List<String>) params.get(ShellCommand.OPERATIONS);
            String[] bundles = new String[bundlesTempList.size()];
            bundles = bundlesTempList.toArray(bundles);
            if(bundles.length == 0) {
                bundlesList.setListData(EMPTY_OPERATIONS);
            } else {
                bundlesList.setListData(bundles);
            }
            refreshWindow();
        } catch (CommandException ex) {
            resultValue.setText(ex.getMessage());
        }
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
                int confirm = JOptionPane.showOptionDialog(
                        null, "Are You Sure to Close Application?",
                        "Exit Confirmation", JOptionPane.YES_NO_OPTION,
                        JOptionPane.QUESTION_MESSAGE, null, null, null);
                if (confirm == 0) {
                    try {
                        Map<String, Object> params = new HashMap<>();
                        params.put(ShellCommand.CALCULATOR_THREAD, calculatorThread);
                        ShellCommand exit = new Exit();
                        exit.execute(params);
                        window.dispose();
                    } catch (CommandException ex) {
                        resultValue.setText(ex.getMessage());
                    }
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
                            Map<String, Object> params = new HashMap<>();
                            params.put(ShellCommand.CALCULATOR_THREAD, calculatorThread);
                            params.put(ShellCommand.PATH, path);
                            params.put(ShellCommand.PROTOCOL, "file:");
                            ShellCommand command = new Add();
                            command.execute(params);
                            updateBundles();
                        } catch (CommandException ex) {
                            errors.append(ex.getMessage());
                            errors.append("\n");
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
                    Map<String, Object> params = new HashMap<>();
                    params.put(ShellCommand.CALCULATOR_THREAD, calculatorThread);
                    params.put(ShellCommand.OPERATIONS, bundlesList.getSelectedValuesList());
                    ShellCommand command = new Remove();
                    command.execute(params);
                    updateBundles();
                } catch (CommandException ex) {
                    resultValue.setText(ex.getMessage());
                }
                refreshWindow();
            }
        };
        removeButton.addActionListener(removeBundle);
    }
}
