package com.zetsubou_0.date;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by Kiryl_Lutsyk on 1/23/2015.
 */
public class Runner {
    public static void main(String[] args) {
        try {
            String startTime = "12:30 AM";
            Date today = new Date();

            int startHour = Integer.parseInt(
                    new SimpleDateFormat("kmm").format(
                            new SimpleDateFormat("hh:mm aa").parse(startTime)));

            int currentHour = Integer.parseInt(new SimpleDateFormat("kmm").format(today));

            if(currentHour - startHour > 0) {
                // today + tomorrow

            } else {
                // yesterday + today

            }

            System.out.println(startHour);
            System.out.println(currentHour);
        } catch (ParseException e) {
            e.printStackTrace();
        }
    }
}
