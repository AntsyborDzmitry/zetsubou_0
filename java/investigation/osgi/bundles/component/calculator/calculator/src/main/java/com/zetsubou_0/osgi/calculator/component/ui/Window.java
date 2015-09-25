package com.zetsubou_0.osgi.calculator.component.ui;

import com.zetsubou_0.osgi.api.ShellCommand;
import com.zetsubou_0.osgi.api.exception.CommandException;
import com.zetsubou_0.osgi.api.observer.Listener;
import com.zetsubou_0.osgi.api.ui.CalculatorUI;
import com.zetsubou_0.osgi.calculator.component.api.DisableListeners;
import com.zetsubou_0.osgi.calculator.component.api.Store;
import org.apache.felix.scr.annotations.*;
import org.apache.felix.scr.annotations.Properties;

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
@org.apache.felix.scr.annotations.Component
@Service(value = {Listener.class, CalculatorUI.class})
@Properties(
        @Property(name = Window.TYPE, value = Window.DEFAULT_TYPE))
public class Window extends JFrame implements Listener, CalculatorUI {
    public static final String DEFAULT_TYPE = "calculatorUI";
    public static final String TYPE = "type";
    public static final int WIDTH = 800;
    public static final int HEIGHT = 600;
    private static final String[] EMPTY_OPERATIONS = new String[]{"Operations not found"};

    @Reference
    private Store calculatorThread;
    @Reference
    private DisableListeners disableListeners;

    /* UI commands */
    @Reference(target = "(" + ShellCommand.SHELL_COMMAND + "=calculate)")
    private ShellCommand calculate;
    @Reference(target = "(" + ShellCommand.SHELL_COMMAND + "=add)")
    private ShellCommand add;
    @Reference(target = "(" + ShellCommand.SHELL_COMMAND + "=remove)")
    private ShellCommand remove;
    @Reference(target = "(" + ShellCommand.SHELL_COMMAND + "=update)")
    private ShellCommand update;
    @Reference(target = "(" + ShellCommand.SHELL_COMMAND + "=exit)")
    private ShellCommand exit;

    private JFrame window;
    private JTextField inputText;
    private JButton calculateButton;
    private JLabel resultValue;
    private JList<String> bundlesList;
    private JButton addButton;
    private JButton removeButton;

    public Window() {
    }

    @Override
    public double calculate(String input) throws CommandException {
        Map<String, Object> params = new HashMap<>();
        params.put(ShellCommand.CALCULATOR_THREAD, calculatorThread);
        params.put(ShellCommand.INPUT_STRING, input);
        calculate.execute(params);
        return (double) params.get(ShellCommand.RESULT);
    }

    @Override
    public void addOperation(String path, String protocol) throws CommandException {
        Map<String, Object> params = new HashMap<>();
        params.put(ShellCommand.CALCULATOR_THREAD, calculatorThread);
        params.put(ShellCommand.PATH, path);
        params.put(ShellCommand.PROTOCOL, protocol);
        add.execute(params);
    }

    @Override
    public void removeOperation(List<String> names) throws CommandException {
        Map<String, Object> params = new HashMap<>();
        params.put(ShellCommand.CALCULATOR_THREAD, calculatorThread);
        params.put(ShellCommand.OPERATIONS, names);
        remove.execute(params);

    }

    @Override
    public List<String> operationsList() throws CommandException {
        Map<String, Object> params = new HashMap<>();
        params.put(ShellCommand.CALCULATOR_THREAD, calculatorThread);
        update.execute(params);
        return  (List<String>) params.get(ShellCommand.OPERATIONS);
    }

    @Override
    public void exitCalculator() throws CommandException {
        Map<String, Object> params = new HashMap<>();
        params.put(ShellCommand.CALCULATOR_THREAD, calculatorThread);
        exit.execute(params);
    }

    @Override
    public void perform() {
        updateBundles();
    }

    @Override
    public void run() {
        init();
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
                    disableListeners.disable();
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
