package com.zetsubou_0.pattern.journaldev.iterator.bean;

import com.zetsubou_0.pattern.journaldev.iterator.ChannelTypeEnum;

/**
 * Created by Kiryl_Lutsyk on 10/5/2015.
 */
public class Channel {
    private double frequency;
    private ChannelTypeEnum type;

    public Channel(double frequency, ChannelTypeEnum type) {
        this.frequency = frequency;
        this.type = type;
    }

    public ChannelTypeEnum getType() {
        return type;
    }

    @Override
    public String toString() {
        return "[" + frequency + "] " + type;
    }
}
