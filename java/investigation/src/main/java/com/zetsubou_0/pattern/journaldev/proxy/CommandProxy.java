package com.zetsubou_0.pattern.journaldev.proxy;

/**
 * Created by Kiryl_Lutsyk on 10/2/2015.
 */
public class CommandProxy implements Command {
    private User user;

    public CommandProxy(User user) {
        this.user = user;
    }

    @Override
    public void execute(String cmd) throws Exception{
        if(user == User.ADMIN) {
            System.out.println(cmd + " was started");
        } else if(user == User.GUEST){
            System.out.println("You login in as guest");
        } else {
            System.out.println("You doesn't login");
        }
    }
}
