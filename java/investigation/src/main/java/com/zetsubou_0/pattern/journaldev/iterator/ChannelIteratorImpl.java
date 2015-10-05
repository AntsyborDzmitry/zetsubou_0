package com.zetsubou_0.pattern.journaldev.iterator;

import com.zetsubou_0.pattern.journaldev.iterator.bean.Channel;

import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 10/5/2015.
 */
public class ChannelIteratorImpl<T extends Channel> implements ChannelIterator<T> {
    private ChannelTypeEnum type;
    private List<T> channels;
    private int position;

    public ChannelIteratorImpl(ChannelTypeEnum type, List<T> channels) {
        this.type = type;
        this.channels = channels;
    }

    @Override
    public boolean hasNext() {
        while (position < channels.size()) {
            Channel c = channels.get(position);
            if (c.getType() == type || type == ChannelTypeEnum.ALL) {
                return true;
            } else
                position++;
        }
        return false;
    }

    @Override
    public T next() throws IllegalStateException {
        T c = channels.get(position);
        position++;
        return c;
    }
}
