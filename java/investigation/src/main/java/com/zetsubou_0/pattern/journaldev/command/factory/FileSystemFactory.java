package com.zetsubou_0.pattern.journaldev.command.factory;

import com.zetsubou_0.pattern.journaldev.command.FileSystem;
import com.zetsubou_0.pattern.journaldev.command.UnixFileSystem;
import com.zetsubou_0.pattern.journaldev.command.WindowsFileSystem;

/**
 * Created by Kiryl_Lutsyk on 10/5/2015.
 */
public class FileSystemFactory {
    private static final String OS = "os.name";
    private static final String WINDOWS = "windows";

    public static FileSystem getFileSystemConfiguration() {
        String system = System.getProperty(OS);
        if(system == null) {
            return null;
        } else if(system.toLowerCase().contains(WINDOWS)) {
            return new WindowsFileSystem();
        } else {
            return new UnixFileSystem();
        }
    }
}
