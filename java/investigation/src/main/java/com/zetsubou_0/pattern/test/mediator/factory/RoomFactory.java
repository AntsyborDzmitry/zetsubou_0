package com.zetsubou_0.pattern.test.mediator.factory;

import com.zetsubou_0.pattern.test.mediator.RoomImpl;
import com.zetsubou_0.pattern.test.mediator.api.Room;
import com.zetsubou_0.pattern.test.mediator.bean.RoomBean;
import com.zetsubou_0.pattern.test.mediator.bean.UserBean;

import java.util.Comparator;
import java.util.TreeSet;

/**
 * Created by Kiryl_Lutsyk on 10/29/2015.
 */
public class RoomFactory {
    private static final Room room = new RoomImpl(new RoomBean() {
        {
            final Comparator<UserBean> userComparator = new Comparator<UserBean>() {
                @Override
                public int compare(UserBean user1, UserBean user12) {
                    return user1.getName().compareTo(user12.getName());
                }
            };
            id = 1;
            description = "The best room";
            userBeans = new TreeSet<>(userComparator);
        }
    });

    public static Room getInstance() {
        return room;
    }
}
