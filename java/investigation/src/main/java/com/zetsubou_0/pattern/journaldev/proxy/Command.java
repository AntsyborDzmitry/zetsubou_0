package com.zetsubou_0.pattern.journaldev.proxy;

/**
 * Created by Kiryl_Lutsyk on 10/2/2015.
 */
public interface Command {
    void execute(String cmd) throws Exception;
}
