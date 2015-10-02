package com.zetsubou_0.pattern.journaldev.mediator;

/**
 * Created by Kiryl_Lutsyk on 10/2/2015.
 */
public class UserImpl extends AbstractUser {
    public UserImpl(String name, MediatorChat mediatorChat) {
        super(name, mediatorChat);
    }

    @Override
    public void sendMsg(String message) {
        System.out.println(this + ": " + message);
        mediatorChat.sendMessage(this, message);
    }

    @Override
    public void receiveMsg(String message) {
        System.out.println(this + " received message: " + message);
    }

    @Override
    public String toString() {
        return "[" + name + "]";
    }
}
