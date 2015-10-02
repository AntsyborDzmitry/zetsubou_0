package com.zetsubou_0.pattern.journaldev.observer;

import java.util.Observable;
import java.util.Observer;

/**
 * Created by Kiryl_Lutsyk on 10/2/2015.
 */
public class MailReceiver implements Observer {
    private String email;

    public MailReceiver(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public void update(Observable o, Object arg) {
        Object[] args = (Object[]) arg;
        StringBuilder sb = new StringBuilder();
        sb.append("<");
        sb.append(email);
        sb.append(">");
        sb.append(" get email from ");
        sb.append("<");
        sb.append(((MailReceiver) args[0]).getEmail());
        sb.append(">: ");
        sb.append((String) args[1]);
        System.out.println(sb.toString());
    }
}
