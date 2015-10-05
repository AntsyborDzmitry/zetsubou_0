package com.zetsubou_0.pattern.journaldev.iterator;

import com.zetsubou_0.pattern.journaldev.iterator.bean.Channel;

/**
 * Created by Kiryl_Lutsyk on 10/5/2015.
 */
public interface ChannelIterator<T extends Channel> {
    boolean hasNext();
    T next() throws IllegalStateException;
}
