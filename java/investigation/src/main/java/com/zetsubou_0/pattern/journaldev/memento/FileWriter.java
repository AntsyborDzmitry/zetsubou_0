package com.zetsubou_0.pattern.journaldev.memento;

/**
 * Created by Kiryl_Lutsyk on 10/5/2015.
 */
public class FileWriter {
    private String filePath;
    private StringBuilder content;

    public FileWriter(String filePath) {
        this.filePath = filePath;
        this.content = new StringBuilder();
    }

    @Override
    public String toString() {
        return content.toString();
    }

    public void write(String text) {
        content.append(text);
    }

    protected Memento save() {
        return new Memento(filePath, content);
    }

    protected void undo(Object memento) {
        filePath = ((Memento) memento).filePath;
        content = ((Memento) memento).content;
    }

    private class Memento {
        private String filePath;
        private StringBuilder content;

        public Memento(String filePath, StringBuilder content) {
            this.filePath = filePath;
            this.content = new StringBuilder(content);
        }
    }
}
