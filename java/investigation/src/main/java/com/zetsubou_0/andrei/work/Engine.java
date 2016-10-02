package com.zetsubou_0.andrei.work;

import javax.swing.JOptionPane;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.*;
import java.nio.channels.FileChannel;

public final class Engine implements ActionListener {
    private MainForm mainForm;

    File lastPathChooser;
    private String path;

    private FileReader sourceFile = null;
    private BufferedReader buffReader = null;

    private FileWriter resultFile = null;
    private BufferedWriter buffWriter = null;

    private StringBuffer textBuffer = new StringBuffer();

    private String ls = System.getProperty("line.separator"); // символы переноса строки
    private int lsLength = ls.length();

    Engine(MainForm mainForm) {
        this.mainForm = mainForm;
    }

    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == mainForm.fileButton) {
            // кнопка "Файл..."
            if (lastPathChooser != null) {
                mainForm.fileChooser.setCurrentDirectory(lastPathChooser);
            }

            int ret = mainForm.fileChooser.showDialog(mainForm.frame, "Открыть"); // ret=0 when file was chosen
            if (ret == 0) {
                lastPathChooser = mainForm.fileChooser.getSelectedFile();
                mainForm.pathTextField.setText(lastPathChooser.toString());
            }

        } else if (e.getSource() == mainForm.applyButton) {
            // кнопка "Применить"
            if (!mainForm.pathTextField.getText().equals("")) {

                switch (mainForm.tabbedPane.getSelectedIndex()) {
                    case 0: // выбрана вкладка Нумеровать кадры
                        if (read()) {
                            deleteNumeration();
                            numerate();

                            if (mainForm.bakCheckBox.isSelected()) {
                                if (makeBackUpFile()) write();
                            } else write();
                        }
                        break;
                    case 1: // выбрана вкладка Дополнительно...

                        boolean deleteEmptyLines = mainForm.deleteEmptyLinesCheckBox.isSelected();
                        boolean deleteSpaces = mainForm.deleteSpacesCheckBox.isSelected();
                        boolean deleteNumeration = mainForm.deleteNumerationCheckBox.isSelected();

                        if (deleteEmptyLines || deleteSpaces || deleteNumeration) {
                            if (read()) {
                                if (deleteEmptyLines) {
                                    deleteEmptyLines();
                                }
                                if (deleteSpaces) {
                                    deleteSpaces();
                                }
                                if (deleteNumeration) {
                                    deleteNumeration();
                                }
                                if (mainForm.bakCheckBox.isSelected()) {
                                    if (makeBackUpFile()) write();
                                } else write();
                            }
                        }
                        break;
                } // конец switch

                textBuffer.delete(0, textBuffer.length());
            }
        }
    }


    /**
     * Считываем файл в переменную textBuffer
     */
    private boolean read() {
        path = mainForm.pathTextField.getText().trim();
        mainForm.pathTextField.setText(path);

        boolean flag = false;

        try {
            sourceFile = new FileReader(path);
            buffReader = new BufferedReader(sourceFile);

            flag = true;

            while (true) {

                //cчитываем файл
                String line = buffReader.readLine();

                if (line == null) break;

                textBuffer.append(line + ls);
            } // конец цикла while

        } catch (FileNotFoundException e) {
            JOptionPane.showMessageDialog(mainForm.frame, "Ошибка. Файл не найден.", mainForm.appTitle, JOptionPane.ERROR_MESSAGE);
            return false;
        } catch (IOException e) {
            JOptionPane.showMessageDialog(mainForm.frame, "Ошибка. Невозможно прочитать файл.", mainForm.appTitle, JOptionPane.ERROR_MESSAGE);
            return false;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(mainForm.frame, "Неизвестная ошибка при открытии файла.", "parent.appTitle", JOptionPane.ERROR_MESSAGE);
            return false;
        } finally {
            try {
                if (flag) {
                    buffReader.close();
                    sourceFile.close();
                }
            } catch (Exception e) {
                JOptionPane.showMessageDialog(mainForm.frame, "Неизвестная ошибка.", "parent.appTitle", JOptionPane.WARNING_MESSAGE);
            }
        }
        return true;
    } // конец read()


    /**
     * Удалить пробелы
     */
    private void deleteSpaces() {

        int startIndex = 0;
        int endIndex;

        if (mainForm.skipCheckBox.isSelected()) {

            startIndex = textBuffer.indexOf("~");
            if (startIndex != -1) {

                endIndex = textBuffer.indexOf(ls, startIndex);
                if (endIndex != -1) {
                    startIndex = endIndex + lsLength;
                }
            } else {
                startIndex = 0;
            }

            endIndex = textBuffer.indexOf(ls, startIndex);
            if (endIndex != -1) {
                startIndex = endIndex + lsLength;
            }
        }

        int hat = startIndex;

        while (true) {
            int index = textBuffer.indexOf(" ", startIndex);

            if (index == -1) break;

            if (mainForm.m2CheckBox.isSelected()) {

                int indexOfM02 = -1;
                int lineAfterM02 = -1;

                int a = textBuffer.indexOf("M02", hat);
                int b = textBuffer.indexOf("M2", hat);

                if (a != -1 && b == -1) {
                    indexOfM02 = a;
                } else if (a == -1 && b != -1) {
                    indexOfM02 = b;
                } else if (a != -1 && b != -1) {
                    if (a < b) {
                        indexOfM02 = a;
                    } else {
                        indexOfM02 = b;
                    }
                }

                if (indexOfM02 != -1) {
                    lineAfterM02 = textBuffer.indexOf(ls, indexOfM02);
                }

                if(lineAfterM02 !=-1 && index > lineAfterM02) break;
            }

            textBuffer.deleteCharAt(index);
            startIndex = index;
        }


    } // конец deleteSpaces()


    /**
     * Удалить пустые строки
     */
    private void deleteEmptyLines() {

        int startIndex = 0;
        if (mainForm.skipCheckBox.isSelected()) {

            startIndex = textBuffer.indexOf("~");
            if (startIndex == -1) {
                startIndex = 0;
            }
        }

        String emptyLine = ls + ls;

        while (true) {
            int index = textBuffer.indexOf(emptyLine, startIndex);
            if (index == -1) break;

            if (mainForm.m2CheckBox.isSelected()) {
                if (textBuffer.indexOf("M02", startIndex) != -1 && index > textBuffer.indexOf("M02", startIndex)) break;
                if (textBuffer.indexOf("M2", startIndex) != -1 && index > textBuffer.indexOf("M2", startIndex)) break;
            }

            textBuffer.delete(index, index + lsLength);
            startIndex = index;
        }

    } // конец deleteEmptyLines()


    /**
     * Удалить номера кадров
     */
    private void deleteNumeration() {

        int startIndex = 0;
        int endIndex;
        if (mainForm.skipCheckBox.isSelected()) {

            startIndex = textBuffer.indexOf("~");
            if (startIndex != -1) {

                endIndex = textBuffer.indexOf(ls, startIndex);
                if (endIndex != -1) {
                    startIndex = endIndex + lsLength;
                }
            } else {
                startIndex = 0; // если ~ не существует, но начинаем с 0 строки
            }
        }

        endIndex = textBuffer.indexOf(ls, startIndex);
        if (endIndex != -1) {
            endIndex = endIndex + lsLength;

            boolean flag = false;
            int hat = startIndex;

            while (endIndex <= textBuffer.length()) {

                if (mainForm.m2CheckBox.isSelected()) {

                    int indexOfM02 = -1;

                    int a = textBuffer.indexOf("M02", hat);
                    int b = textBuffer.indexOf("M2", hat);

                    if (a != -1 && b == -1) {
                        indexOfM02 = a;
                    } else if (a == -1 && b != -1) {
                        indexOfM02 = b;
                    } else if (a != -1 && b != -1) {
                        if (a < b) {
                            indexOfM02 = a;
                        } else {
                            indexOfM02 = b;
                        }
                    }

                    if(indexOfM02 !=-1 && startIndex > indexOfM02) break;
                }

                if (textBuffer.indexOf(ls, startIndex) != startIndex) { // если строка не пустая
                    char c = textBuffer.charAt(startIndex);

                    if (c == '/') {
                        startIndex++;
                        c = textBuffer.charAt(startIndex);
                    }

                    if (c == 'N') {
                        int counter = startIndex + 1;
                        boolean isNomber = false; // флаг, показывает это номер кадра или просто N

                        while (Character.isDigit(textBuffer.charAt(counter)) || textBuffer.charAt(counter) == ' ') {
                            isNomber = true;
                            counter++;
                        }

                        if (isNomber) {
                            textBuffer.delete(startIndex, counter);
                            endIndex = endIndex - counter; // т.к. после удаления подстроки сместился endIndex
                        }
                    }
                }

                if (flag) break;

                startIndex = endIndex;
                endIndex = textBuffer.indexOf(ls, startIndex) + lsLength;

                if (endIndex >= textBuffer.length()) {
                    endIndex = textBuffer.length();
                    flag = true; // определяет выполнился ли хотя бы один наз if
                }
            } // конец while
        }
    } // конец deleteNumeration()


    /**
     * Нумерация кадров
     */
    private void numerate() {
        StringBuffer resultText = new StringBuffer();
        int startIndex = 0;
        int endIndex;
        int selectedStep = 5;

        switch (mainForm.stepComboBox.getSelectedIndex()) {
            case 0:
                selectedStep = 1;
                break;

            case 1:
                selectedStep = 5;
                break;

            case 2:
                selectedStep = 10;
                break;
        }

        int stepNo = selectedStep;

        if (mainForm.skipCheckBox.isSelected()) {
            startIndex = textBuffer.indexOf("~");

            // если ~ сущетствует, то переносим все до него
            if (startIndex != -1) {
                endIndex = textBuffer.indexOf(ls, startIndex);

                if (endIndex != -1) {
                    endIndex = endIndex + lsLength;
                    for (int i = 0; i < endIndex; i++) {
                        resultText.append(textBuffer.charAt(i));
                    }

                    startIndex = endIndex;
                }
            } else {
                startIndex = 0; // если ~ не существует, но начинаем с нуля
            }
        }

        endIndex = textBuffer.indexOf(ls, startIndex);

        if (endIndex != -1) {
            boolean flag = false;
            boolean spaceIsSelected = mainForm.spaceCheckBox.isSelected();

            endIndex = endIndex + lsLength;
            int hat = startIndex;

            while (endIndex <= textBuffer.length()) {

                if (mainForm.m2CheckBox.isSelected()) {

                    int indexOfM02 = -1;

                    int a = textBuffer.indexOf("M02", hat);
                    int b = textBuffer.indexOf("M2", hat);

                    if (a != -1 && b == -1) {
                        indexOfM02 = a;
                    } else if (a == -1 && b != -1) {
                        indexOfM02 = b;
                    } else if (a != -1 && b != -1) {
                        if (a < b) {
                            indexOfM02 = a;
                        } else {
                            indexOfM02 = b;
                        }
                    }

                    if(indexOfM02 !=-1 && startIndex > indexOfM02) {
                        for (int i = startIndex; i < textBuffer.length(); i++) {
                            resultText.append(textBuffer.charAt(i));
                        }
                        break;
                    }
                }

                // добавляем номера кадров
                // if определяет два идущих подряд переноса строки
                if (textBuffer.indexOf(ls, startIndex) != startIndex) {
                    char c = textBuffer.charAt(startIndex);

                    if (c == '/') {
                        resultText.append(c);
                        startIndex++;
                        c = textBuffer.charAt(startIndex);
                    }

                    if (c != '%' && c !=':' && c != ';' && c != '(' && c != '!') {

                        // у старого ГФ в начале программы O1 не нумеровать
                        if (!(c == 'O' && Character.isDigit(textBuffer.charAt(startIndex + 1)))) {
                            if (spaceIsSelected) {
                                resultText.append("N" + stepNo + " ");
                            } else {
                                resultText.append("N" + stepNo);
                            }
                            stepNo = stepNo + selectedStep;
                        }
                    }
                }

                for (int i = startIndex; i < endIndex; i++) {
                    resultText.append(textBuffer.charAt(i));
                }

                if (flag) break;

                startIndex = endIndex;
                endIndex = textBuffer.indexOf(ls, startIndex) + lsLength;

                if (endIndex >= textBuffer.length()) {
                    endIndex = textBuffer.length();
                    flag = true; // определяет выполнился ли хотя бы один наз if
                }
            } // конец while
        }

        textBuffer.delete(0, textBuffer.length());
        textBuffer.append(resultText);
    } // конец mumerare()


    /**
     * Запись в файл
     */
    private void write() {

        try {
            resultFile = new FileWriter(path);
            buffWriter = new BufferedWriter(resultFile);

            buffWriter.write(textBuffer.toString());
        } catch (IOException e) {
            JOptionPane.showMessageDialog(mainForm.frame, "Ошибка записи.", mainForm.appTitle, JOptionPane.ERROR_MESSAGE);
        } finally {
            try {
                buffWriter.flush();
                buffWriter.close();
                resultFile.close();
            } catch (IOException e) {
                JOptionPane.showMessageDialog(mainForm.frame, "Неизвестная ошибка записи.", mainForm.appTitle, JOptionPane.ERROR_MESSAGE);
            }
        }
        JOptionPane.showMessageDialog(mainForm.frame, "Готово!", mainForm.appTitle, JOptionPane.INFORMATION_MESSAGE);
    } // конец write()


    /**
     * Создаёт резервную копию *.bak
     */
    private boolean makeBackUpFile() {
        File file = new File(path);
        String bakPath;

        if (path.lastIndexOf(".") == path.length() - 4) {
            bakPath = path.substring(0, path.length() - 4);
        } else {
            bakPath = path;
        }

        File backup = new File(bakPath + ".bak");

        return copyFile(file, backup);
    }


    /**
     * Создает копию файла
     */
    private boolean copyFile(File source, File dest) {
        FileChannel sourceChannel = null;
        FileChannel destChannel = null;
        try {
            sourceChannel = new FileInputStream(source).getChannel();
            destChannel = new FileOutputStream(dest).getChannel();
            destChannel.transferFrom(sourceChannel, 0, sourceChannel.size());
        } catch (IOException e) {
            JOptionPane.showMessageDialog(mainForm.frame, "Ошибка. Не удается создать .bak файл.", mainForm.appTitle, JOptionPane.ERROR_MESSAGE);
            return false;
        } finally {
            try {
                sourceChannel.close();
                destChannel.close();
            } catch (IOException e1) {
                JOptionPane.showMessageDialog(mainForm.frame, "Неизвестная ошибка при создании .bak файла.", mainForm.appTitle, JOptionPane.ERROR_MESSAGE);
                return false;
            }
        }
        return true;
    } // конец copyFile()
}