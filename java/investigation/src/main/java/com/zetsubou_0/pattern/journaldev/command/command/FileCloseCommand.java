package com.zetsubou_0.pattern.journaldev.command.command;

import com.zetsubou_0.pattern.journaldev.command.FileSystem;

/**
 * Created by Kiryl_Lutsyk on 10/5/2015.
 */
public class FileCloseCommand implements Command {
    FileSystem fileSystem;

    public FileCloseCommand(FileSystem fileSystem) {
        this.fileSystem = fileSystem;
    }

    @Override
    public void execute() {
        fileSystem.close();
    }
}
