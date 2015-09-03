package com.zetsubou_0.osgi.calculator.ui;

import javax.swing.*;
import java.awt.*;

/**
 * Created by Kiryl_Lutsyk on 9/3/2015.
 */
public class Window extends JFrame {
    private JTextArea textArea;

    public Window() {
        textArea = new JTextArea();
        textArea.setSize(800, 600);
        this.getContentPane().add(textArea, BorderLayout.CENTER);
        this.setBounds(0, 0, 800, 600);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.setVisible(true);
    }

    public JTextArea getTextArea() {
        return textArea;
    }
}
