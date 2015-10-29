package com.zetsubou_0.pattern.test.mediator.api;

import com.zetsubou_0.pattern.test.mediator.bean.UserBean;

/**
 * Created by Kiryl_Lutsyk on 10/29/2015.
 */
public interface Room {
    void addUser(UserBean userBean);
    void sendMessage(String message, UserBean userBean);
}
