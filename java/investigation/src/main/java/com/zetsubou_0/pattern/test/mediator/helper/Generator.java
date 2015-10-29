package com.zetsubou_0.pattern.test.mediator.helper;

import com.zetsubou_0.pattern.test.mediator.bean.UserBean;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Created by Kiryl_Lutsyk on 10/29/2015.
 */
public class Generator {
    private static final List<String> userNames = new ArrayList<String>() {
        {
            add("Alice");
            add("Nick");
            add("Sam");
            add("Kate");
        }
    };
    private static final List<String> userLastNames = new ArrayList<String>() {
        {
            add("A");
            add("N");
            add("S");
            add("K");
        }
    };
    private static final List<String> words = new ArrayList<String>() {
        {
            add("Hello");
            add("How are you?");
            add("Hi");
            add("Have a nice day");
        }
    };

    public static UserBean createUser() {
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        sb.append(userNames.get(random.nextInt(4)));
        sb.append(" ");
        sb.append(userLastNames.get(random.nextInt(4)));
        UserBean user = new UserBean();
        user.setName(sb.toString());
        return user;
    }

    public static String say() {
        Random random = new Random();
        return words.get(random.nextInt(4));
    }
}
