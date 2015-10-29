package com.zetsubou_0.pattern.test.mediator;

import com.zetsubou_0.pattern.test.mediator.api.Room;
import com.zetsubou_0.pattern.test.mediator.bean.RoomBean;
import com.zetsubou_0.pattern.test.mediator.bean.UserBean;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Date;

/**
 * Created by Kiryl_Lutsyk on 10/29/2015.
 */
public class RoomImpl implements Room {
    private static final String PATH = "d:\\temp\\00\\users\\";

    private final RoomBean roomBean;

    public RoomImpl(RoomBean roomBean) {
        this.roomBean = roomBean;
    }

    @Override
    public void addUser(UserBean userBean) {
        roomBean.getUserBeans().add(userBean);
    }

    @Override
    public void sendMessage(String message, UserBean userBean) {
        printMessage(userBean.getName(), userBean.getId(), message, true);

        for (UserBean user : roomBean.getUserBeans()) {
            printMessage(userBean.getName(), user.getId(), message, false);
        }
    }

    private void printMessage(String userName, long id, String message, boolean isOwner) {
        try {
            synchronized (this) {
                StringBuilder sb = new StringBuilder();
                sb.append(new Date());
                if (!isOwner) {
                    sb.append(" [");
                } else {
                    sb.append(" <<");
                }
                sb.append(userName);
                if (!isOwner) {
                    sb.append("]");
                } else {
                    sb.append(">>");
                }
                sb.append(": ");
                sb.append(message);
                sb.append("\n");
                File file = new File(PATH + id);
                if (!file.exists()) {
                    file.createNewFile();
                }
                Files.write(Paths.get(file.getPath()), sb.toString().getBytes(), StandardOpenOption.APPEND);
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
