package com.zetsubou_0.pattern.journaldev.mediator;

/**
 * Created by Kiryl_Lutsyk on 10/2/2015.
 */
public abstract class AbstractUser implements User {
    protected String name;
    protected MediatorChat mediatorChat;

    public AbstractUser(String name, MediatorChat mediatorChat) {
        this.name = name;
        this.mediatorChat = mediatorChat;
    }
}
