package com.zetsubou_0.pattern.journaldev.memento;

import java.util.Deque;
import java.util.LinkedList;

/**
 * Created by Kiryl_Lutsyk on 10/5/2015.
 */
public class FileWriterCaretaker {
    private Deque<Object> mementoQueue = new LinkedList<>();

    public void save(FileWriter fileWriter) {
        mementoQueue.push(fileWriter.save());
    }

    public void undo(FileWriter fileWriter) {
        fileWriter.undo(mementoQueue.pollFirst());
    }
}
