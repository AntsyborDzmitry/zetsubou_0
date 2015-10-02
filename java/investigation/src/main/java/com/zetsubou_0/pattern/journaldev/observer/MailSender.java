package com.zetsubou_0.pattern.journaldev.observer;

import java.util.Observable;

/**
 * Created by Kiryl_Lutsyk on 10/2/2015.
 */
public class MailSender extends Observable {
    public void sendMail(MailReceiver user, String message) {
        deleteObserver(user);
        setChanged();
        notifyObservers(new Object[] {user, message});
        addObserver(user);
    }
}
