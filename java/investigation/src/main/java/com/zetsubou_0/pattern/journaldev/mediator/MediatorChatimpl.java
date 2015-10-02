package com.zetsubou_0.pattern.journaldev.mediator;

import java.util.HashSet;
import java.util.Set;

/**
 * Created by Kiryl_Lutsyk on 10/2/2015.
 */
public class MediatorChatimpl implements MediatorChat {
    private final Set<User> users = new HashSet<>();

    @Override
    public void addUser(User user) {
        users.add(user);
    }

    @Override
    public void sendMessage(User sender, String message) {
        for(User user : users) {
            if(!user.equals(sender)) {
                user.receiveMsg(message);
            }
        }
    }
}
