package com.zetsubou_0.pattern.journaldev.iterator;

import com.zetsubou_0.pattern.journaldev.iterator.bean.Channel;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 10/5/2015.
 */
public class ChannelCollectionImpl<T extends Channel> implements ChannelCollection<T> {
    private List<T> channels = new ArrayList<>();

    @Override
    public void add(T channel) {
        channels.add(channel);
    }

    @Override
    public void remove(T channel) {
        channels.remove(channel);
    }

    @Override
    public ChannelIterator<T> iterator(ChannelTypeEnum type) {
        return new ChannelIteratorImpl<>(type, channels);
    }
}
