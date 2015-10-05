package com.zetsubou_0.pattern.journaldev.command;

/**
 * Created by Kiryl_Lutsyk on 10/5/2015.
 */
public class WindowsFileSystem implements FileSystem {
    @Override
    public void read() {
        System.out.println("Windows read file");
    }

    @Override
    public void close() {
        System.out.println("Windows close file");
    }
}
