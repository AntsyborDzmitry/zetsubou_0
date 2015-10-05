package com.zetsubou_0.pattern.journaldev.iterator;

import com.zetsubou_0.pattern.journaldev.iterator.bean.Channel;

/**
 * Created by Kiryl_Lutsyk on 10/5/2015.
 */
public interface ChannelCollection<T extends Channel> {
    void add(T channel);
    void remove(T channel);
    ChannelIterator<T> iterator(ChannelTypeEnum type);
}
