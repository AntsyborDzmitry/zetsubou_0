package com.zetsubou_0.pattern.journaldev.mediator;

/**
 * Created by Kiryl_Lutsyk on 10/2/2015.
 */
public interface MediatorChat {
    void addUser(User user);
    void sendMessage(User sender, String message);
}
