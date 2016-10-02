package com.zetsubou_0.andrei.work;

import javax.swing.*;
import javax.swing.filechooser.FileNameExtensionFilter;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.GridBagConstraints;
import java.io.File;

public final class MainForm {

    final String appTitle = "Нумерация кадров УП";

    JTextField pathTextField = new JTextField();

    JButton fileButton = new JButton("Файл...");
    JButton applyButton = new JButton("Применить");

    JCheckBox skipCheckBox  = new JCheckBox("После: ~");
    JCheckBox m2CheckBox  = new JCheckBox("До: M2");
    JCheckBox spaceCheckBox = new JCheckBox("Пробел");
    JCheckBox bakCheckBox = new JCheckBox(".bak");

    JCheckBox deleteNumerationCheckBox = new JCheckBox("Удалить номера кадров");
    JCheckBox deleteEmptyLinesCheckBox = new JCheckBox("Удалить пустые строки");
    JCheckBox deleteSpacesCheckBox = new JCheckBox("Удалить пробелы");

    String[] comboBoxItems = {
            "1",
            "5",
            "10"
    };
    JComboBox stepComboBox = new JComboBox(comboBoxItems);

    JTabbedPane tabbedPane = new JTabbedPane();

    JFrame frame = new JFrame(appTitle);

    JFileChooser fileChooser = new JFileChooser();

    // конструктор
    private MainForm(String arg) {
        Engine engine = new Engine(this);
        FileNameExtensionFilter textFilter = new FileNameExtensionFilter("Текстовые (*.prj;*.prg;*.bak;*.txt)", "prj", "prg", "bak", "txt");
        FileNameExtensionFilter sinumerikFilter = new FileNameExtensionFilter("Sinumerik (*.mpf;*.spf;*.arc)", "mpf", "spf", "arc");
        FileNameExtensionFilter fagorFilter = new FileNameExtensionFilter("Fagor (*.pit;*.pim)", "pit", "pim");
        fileChooser.addChoosableFileFilter(textFilter);
        fileChooser.addChoosableFileFilter(sinumerikFilter);
        fileChooser.addChoosableFileFilter(fagorFilter);

        // установить директорию по умолчанию, если путь к ней был передан в параметрах запуска приложения
        if (arg != null) {
            engine.lastPathChooser = new File(arg);
        }

        JPanel numerationPanel = new JPanel();
        JPanel extraPanel = new JPanel();

        tabbedPane.addTab("Нумерация кадров", numerationPanel);
        tabbedPane.addTab("Удаление лишних символов", extraPanel);

        JPanel contentPanel = new JPanel();

        stepComboBox.setSelectedIndex(1);

        JLabel stepLabel  = new JLabel("Шаг:");
        stepLabel.setToolTipText("Шаг нумерации");

        skipCheckBox.setSelected(true);
        skipCheckBox.setToolTipText("Применить только для строк ниже символа ~");

        m2CheckBox.setSelected(true);
        m2CheckBox.setToolTipText("Применить до M02");

        stepComboBox.setToolTipText("Шаг нумерации");
        spaceCheckBox.setToolTipText("Вставлять пробел после номера кадра");

        bakCheckBox.setSelected(true);
        bakCheckBox.setToolTipText("Создать резервную копию файла");

        fileButton.setFocusable(false);
        fileButton.setToolTipText("Выбрать файл");
        fileButton.addActionListener(engine);


        applyButton.addActionListener(engine);


        GridBagLayout gbl = new GridBagLayout();
        contentPanel.setLayout(gbl);
        GridBagConstraints c = new GridBagConstraints();

        // pathTextField
        c.anchor = GridBagConstraints.WEST;
        c.fill = GridBagConstraints.HORIZONTAL;
        c.gridheight = 1;
        c.gridwidth = 2;
        c.gridx = 0;
        c.gridy = 0;
        c.insets = new Insets(0, 0, 0, 4);
        c.ipadx = 0;
        c.ipady = 0;
        c.weightx = 0.0;
        c.weighty = 0.0;
        gbl.setConstraints(pathTextField, c);
        contentPanel.add(pathTextField);

        // fileButton
        c.anchor = GridBagConstraints.EAST;
        c.fill = GridBagConstraints.NONE;
        c.gridheight = 1;
        c.gridwidth = 1;
        c.gridx = 2;
        c.gridy = 0;
        c.insets = new Insets(0, 0, 0, 0);
        c.ipadx = 0;
        c.ipady = 0;
        c.weightx = 0.0;
        c.weighty = 0.0;
        gbl.setConstraints(fileButton, c);
        contentPanel.add(fileButton);

        // skipCheckBox
        c.anchor = GridBagConstraints.WEST;
        c.fill = GridBagConstraints.NONE;
        c.gridheight = 1;
        c.gridwidth = 1;
        c.gridx = 0;
        c.gridy = 1;
        c.insets = new Insets(5, 0, 5, 0);
        c.ipadx = 0;
        c.ipady = 0;
        c.weightx = 0.0;
        c.weighty = 0.0;
        gbl.setConstraints(skipCheckBox, c);
        contentPanel.add(skipCheckBox);

        // endOfProgramCheckBox
        c.anchor = GridBagConstraints.WEST;
        c.fill = GridBagConstraints.NONE;
        c.gridheight = 1;
        c.gridwidth = 1;
        c.gridx = 1;
        c.gridy = 1;
        c.insets = new Insets(5, 15, 5, 125);
        c.ipadx = 0;
        c.ipady = 0;
        c.weightx = 0.0;
        c.weighty = 0.0;
        gbl.setConstraints(m2CheckBox, c);
        contentPanel.add(m2CheckBox);

        // bakCheckBox
        c.anchor = GridBagConstraints.EAST;
        c.fill = GridBagConstraints.NONE;
        c.gridheight = 1;
        c.gridwidth = 1;
        c.gridx = 2;
        c.gridy = 1;
        c.insets = new Insets(5, 0, 5, 0);
        c.ipadx = 0;
        c.ipady = 0;
        c.weightx = 0.0;
        c.weighty = 0.0;
        gbl.setConstraints(bakCheckBox, c);
        contentPanel.add(bakCheckBox);

        // tabbedPane
        c.anchor = GridBagConstraints.EAST;
        c.fill = GridBagConstraints.HORIZONTAL;
        c.gridheight = 1;
        c.gridwidth = 3;
        c.gridx = 0;
        c.gridy = 2;
        c.insets = new Insets(0, 0, 0, 0);
        c.ipadx = 0;
        c.ipady = 0;
        c.weightx = 0.0;
        c.weighty = 0.0;
        gbl.setConstraints(tabbedPane, c);
        contentPanel.add(tabbedPane);


        numerationPanel.setLayout(gbl);

        // stepLabel
        c.anchor = GridBagConstraints.EAST;
        c.fill = GridBagConstraints.NONE;
        c.gridheight = 1;
        c.gridwidth = 1;
        c.gridx = 0;
        c.gridy = 0;
        c.insets = new Insets(0, 0, 0, 0);
        c.ipadx = 0;
        c.ipady = 0;
        c.weightx = 0.0;
        c.weighty = 0.0;
        gbl.setConstraints(stepLabel, c);
        numerationPanel.add(stepLabel);

        // stepComboBox
        c.anchor = GridBagConstraints.WEST;
        c.fill = GridBagConstraints.NONE;
        c.gridheight = 1;
        c.gridwidth = 1;
        c.gridx = 1;
        c.gridy = 0;
        c.insets = new Insets(0, 5, 0, 10);
        c.ipadx = 0;
        c.ipady = 0;
        c.weightx = 0.0;
        c.weighty = 0.0;
        gbl.setConstraints(stepComboBox, c);
        numerationPanel.add(stepComboBox);

        // spaceCheckBox
        c.anchor = GridBagConstraints.WEST;
        c.fill = GridBagConstraints.NONE;
        c.gridheight = 1;
        c.gridwidth = 1;
        c.gridx = 2;
        c.gridy = 0;
        c.insets = new Insets(0, 0, 0, 0);
        c.ipadx = 0;
        c.ipady = 0;
        c.weightx = 0.0;
        c.weighty = 0.0;
        gbl.setConstraints(spaceCheckBox, c);
        numerationPanel.add(spaceCheckBox);

        // applyButton
        c.anchor = GridBagConstraints.CENTER;
        c.fill = GridBagConstraints.NONE;
        c.gridheight = 1;
        c.gridwidth = 3;
        c.gridx = 0;
        c.gridy = 3;
        c.insets = new Insets(5, 0, 0, 0);
        c.ipadx = 0;
        c.ipady = 0;
        c.weightx = 0.0;
        c.weighty = 0.0;
        gbl.setConstraints(applyButton, c);
        contentPanel.add(applyButton);


        extraPanel.setLayout(gbl);

        // deleteEmptyLinesCheckBox
        c.anchor = GridBagConstraints.WEST;
        c.fill = GridBagConstraints.NONE;
        c.gridheight = 1;
        c.gridwidth = 1;
        c.gridx = 0;
        c.gridy = 0;
        c.insets = new Insets(0, 0, 0, 0);
        c.ipadx = 0;
        c.ipady = 0;
        c.weightx = 0.0;
        c.weighty = 0.0;
        gbl.setConstraints(deleteEmptyLinesCheckBox, c);
        extraPanel.add(deleteEmptyLinesCheckBox);

        // deleteSpacesCheckBox
        c.anchor = GridBagConstraints.WEST;
        c.fill = GridBagConstraints.NONE;
        c.gridheight = 1;
        c.gridwidth = 1;
        c.gridx = 0;
        c.gridy = 1;
        c.insets = new Insets(0, 0, 0, 0);
        c.ipadx = 0;
        c.ipady = 0;
        c.weightx = 0.0;
        c.weighty = 0.0;
        gbl.setConstraints(deleteSpacesCheckBox, c);
        extraPanel.add(deleteSpacesCheckBox);

        // deleteNumerationCheckBox
        c.anchor = GridBagConstraints.WEST;
        c.fill = GridBagConstraints.NONE;
        c.gridheight = 1;
        c.gridwidth = 1;
        c.gridx = 1;
        c.gridy = 0;
        c.insets = new Insets(0, 30, 0, 0);
        c.ipadx = 0;
        c.ipady = 0;
        c.weightx = 0.0;
        c.weighty = 0.0;
        gbl.setConstraints(deleteNumerationCheckBox, c);
        extraPanel.add(deleteNumerationCheckBox);

        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.getRootPane().setDefaultButton(applyButton);
        frame.setContentPane(contentPanel);
        frame.pack();
        frame.setResizable(false);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);

    } // конец конструктора

    private void setupCheckbox(JCheckBox checkBox, String toolTip, boolean checked) {
        checkBox.setSelected(checked);
        checkBox.setToolTipText(toolTip);
    }

    public static void main(String[] args) {
        try {
            String systemLookAndFeelClassName = UIManager.getSystemLookAndFeelClassName();

            UIManager.put("FileChooser.openButtonText", "Открыть");
            UIManager.put("FileChooser.cancelButtonText", "Отмена");
            UIManager.put("FileChooser.lookInLabelText", "Папка:");
            UIManager.put("FileChooser.fileNameLabelText", "Имя файла:");
            UIManager.put("FileChooser.filesOfTypeLabelText", "Тип файла:");

            UIManager.put("FileChooser.fileNameLabelToolTipText", "Открыть");
            UIManager.put("FileChooser.cancelButtonToolTipText", "Отмена");
            UIManager.put("FileChooser.upFolderToolTipText", "На один уровень вверх");
            UIManager.put("FileChooser.newFolderToolTipText", "Создать новую папку");
            UIManager.put("FileChooser.detailsViewButtonToolTipText", "Вид");

            UIManager.put("FileChooser.fileNameLabelText", "Имя файла");
            UIManager.put("FileChooser.filesOfTypeLabelText", "Тип файлов");
            UIManager.put("FileChooser.listViewButtonToolTipText", "Список");
            UIManager.put("FileChooser.detailsViewButtonToolTipText", "Таблица");

            UIManager.put("FileChooser.fileNameHeaderText", "Имя");
            UIManager.put("FileChooser.fileSizeHeaderText", "Размер");
            UIManager.put("FileChooser.fileTypeHeaderText", "Тип");
            UIManager.put("FileChooser.fileDateHeaderText", "Изменен");
            UIManager.put("FileChooser.fileAttrHeaderText", "Атрибуты");
            UIManager.put("FileChooser.acceptAllFileFilterText", "Все файлы");

            UIManager.setLookAndFeel(systemLookAndFeelClassName);
        } catch (Exception e) {
        } finally {
            if (args.length == 1) {
                new MainForm(args[0]);
            } else {
                new MainForm(null);
            }
        }
    } // конец main
}