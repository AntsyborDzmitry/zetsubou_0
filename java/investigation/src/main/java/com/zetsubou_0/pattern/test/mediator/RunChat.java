package com.zetsubou_0.pattern.test.mediator;

import com.zetsubou_0.pattern.test.mediator.api.Room;
import com.zetsubou_0.pattern.test.mediator.bean.UserBean;
import com.zetsubou_0.pattern.test.mediator.factory.RoomFactory;
import com.zetsubou_0.pattern.test.mediator.helper.Generator;

/**
 * Created by Kiryl_Lutsyk on 10/29/2015.
 */
public class RunChat {
    public static void main(String[] args) {
        Room room = RoomFactory.getInstance();

        UserBean user1 = Generator.createUser();
        UserBean user2 = Generator.createUser();
        UserBean user3 = Generator.createUser();
        UserBean user4 = Generator.createUser();

        room.addUser(user1);
        room.addUser(user2);
        room.addUser(user3);
        room.addUser(user4);

        room.sendMessage(Generator.say(), user1);
        room.sendMessage(Generator.say(), user2);
        room.sendMessage(Generator.say(), user3);
        room.sendMessage(Generator.say(), user4);
        room.sendMessage(Generator.say(), user1);
        room.sendMessage(Generator.say(), user2);
        room.sendMessage(Generator.say(), user3);
        room.sendMessage(Generator.say(), user4);
        room.sendMessage(Generator.say(), user1);
        room.sendMessage(Generator.say(), user2);
        room.sendMessage(Generator.say(), user3);
        room.sendMessage(Generator.say(), user4);
    }
}
