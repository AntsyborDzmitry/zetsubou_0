package com.zetsubou_0.pattern.journaldev.iterator.helper;

import com.zetsubou_0.pattern.journaldev.iterator.ChannelIterator;

/**
 * Created by Kiryl_Lutsyk on 10/5/2015.
 */
public class ChannelPrinter {
    public static void printChannels(ChannelIterator iterator) {
        while(iterator.hasNext()) {
            System.out.println(iterator.next());
        }
    }
}
